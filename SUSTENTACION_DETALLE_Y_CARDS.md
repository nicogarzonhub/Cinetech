# Sustentación técnica — detalle de película y tarjetas de Inicio

## Alcance

Este documento explica las decisiones de diseño, datos y experiencia de usuario de la ficha de detalle (`/pelicula/:id`) y de las tarjetas de película usadas en Inicio. Ambas partes consumen modelos propios de la aplicación, no respuestas crudas de TMDB; así, los componentes presentan información y la infraestructura se encarga de validar, normalizar y traducir los datos externos.

## Ficha de detalle

### Ruta validada y caché por película

La pantalla toma el `id` desde la URL y comprueba que sea numérico antes de consultar la API. Una URL inválida no genera una petición innecesaria y muestra un estado de error con una acción para volver al inicio. Cuando es válido, `useMovieDetail` usa la clave `['movies', 'detail', id]`, que separa en caché la ficha de cada película de las búsquedas y tendencias.

### Una consulta enriquecida

El repositorio llama a `/movie/:id` con `append_to_response=credits,videos`. Esta decisión obtiene ficha, reparto y vídeos en una sola petición, reduce latencia y evita solicitudes dependientes entre sí. Es especialmente útil frente a límites de tasa de una API externa.

Zod valida los campos que se usan antes de construir `MovieDetail`. Además, el adaptador ordena el reparto por importancia, lo limita a doce personas, prioriza un tráiler oficial de YouTube y genera URL de imágenes con tamaños acordes a cada contexto: `w500` para póster, `w1280` para fondo y `w185` para perfiles.

| Zona      | Información                               | Justificación                                                         |
| --------- | ----------------------------------------- | --------------------------------------------------------------------- |
| Cabecera  | Fondo, póster, título y título original   | Identifica la película antes de mostrar información secundaria.       |
| Metadatos | Fecha, duración, valoración y géneros     | Reúne los criterios más útiles para decidir si verla.                 |
| Acciones  | Tráiler y sitio oficial                   | Solo se muestran cuando existe una URL proporcionada por la API.      |
| Contenido | Sinopsis, reparto e información adicional | Permite profundizar sin saturar la cabecera.                          |
| Lateral   | Dirección, productoras e IMDb             | Mantiene los datos complementarios separados del contenido principal. |

La composición pasa de dos columnas en escritorio a una en móvil. El contenedor del póster mantiene una proporción 2:3, por lo que el diseño no cambia bruscamente mientras se cargan imágenes.

### Estados y datos ausentes

La ficha contempla carga, error y éxito. `DetailSkeleton` replica la estructura visual durante la consulta y usa `aria-busy="true"`. Ante una ruta inválida o un error de red se muestra un mensaje claro dentro de `role="alert"`, con reintento solo cuando hay un identificador válido.

No se da por hecho que TMDB incluya todos los datos. La interfaz tiene alternativas para póster, fecha, duración, sinopsis, reparto, dirección y productoras. Por ello nunca se imprimen `null`, enlaces vacíos ni imágenes rotas. Las fechas y cifras se presentan con `Intl`, usando formato `es-CO`; no se construyen formatos monetarios ni fechas manualmente.

## Tarjetas e Inicio

### Un componente reutilizable

`MovieCard` recibe un `MovieSummary` con título, póster, estado de estreno, valoración e identificadores de género. El mismo componente se reutiliza en Inicio, búsqueda, biblioteca, listas y filas por género. La tarjeta no conoce Axios, TMDB ni `localStorage`: su responsabilidad es presentar una película, navegar a su ficha y permitir guardarla.

- Si el póster no existe, muestra una alternativa textual en lugar de una URL rota.
- El estreno se modela como `released`, `upcoming` o `unknown`; la etiqueta expresa el estado con texto y color, no solo con color.
- La fecha se formatea en UTC para que no se desplace por la zona horaria de quien la consulta.
- El atributo `loading="lazy"` posterga la descarga de pósters que no están visibles.

La tarjeta completa es un enlace a `/pelicula/:id`. El marcador es un botón independiente: `preventDefault()` permite guardar o retirar una película sin activar la navegación. Su etiqueta accesible cambia entre “Guardar en Cineteca” y “Quitar de Cineteca”. El estado se obtiene del proveedor de cineteca, mientras que la persistencia queda aislada en `LocalStorageCineteca`.

### Filtros y cuadrícula compacta

Inicio consulta las tendencias semanales una vez mediante `useTrendingMovies`. Los filtros se aplican en memoria sobre esa respuesta, por lo que el cambio es inmediato y no agrega solicitudes a TMDB.

| Filtro          | Criterio                                           |
| --------------- | -------------------------------------------------- |
| Tendencias      | Orden original entregado por TMDB.                 |
| Estrenadas      | Estado `released`.                                 |
| Por estrenar    | Estado `upcoming`.                                 |
| Mejor valoradas | Copia ordenada de mayor a menor por `voteAverage`. |

Este filtrado local es adecuado para un conjunto compacto como tendencias. Si la aplicación necesitara manejar grandes catálogos o filtros avanzados, el siguiente paso sería usar el endpoint `discover` con paginación en servidor.

La cuadrícula pasa de tres columnas en móvil hasta seis en pantalla grande. Las tarjetas reducen espaciado, texto e icono del marcador, logrando mostrar más películas por fila sin perder título, estado ni acciones. Inicio también cubre los estados de carga con esqueletos, error con reintento, vacío por filtro y resultado exitoso.

## Accesibilidad y rendimiento

| Decisión                                                                  | Aporte                                                                  |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Foco visible en enlaces y botones                                         | Permite recorrer tarjetas y acciones con teclado.                       |
| `alt=""` en fondos decorativos y texto alternativo en el póster principal | Evita ruido en lectores de pantalla y describe imágenes significativas. |
| `role="alert"` y `aria-busy`                                              | Comunica cambios de estado a tecnologías de asistencia.                 |
| Esqueletos y proporciones reservadas                                      | Reduce los saltos visuales al cargar datos e imágenes.                  |
| Carga diferida de pósters                                                 | Prioriza contenido visible y reduce transferencia inicial.              |

## Mejoras recomendadas

1. Añadir pruebas de interfaz para ficha: ID inválido, carga, error, ausencia de datos y tráiler oficial.
2. Probar `MovieCard` por rol y nombre accesible: enlace, guardar, retirar y estado de estreno.
3. Dar al enlace de cada tarjeta un nombre accesible más completo con título, fecha y valoración.
4. Mover el foco al encabezado y actualizar el título del documento al entrar al detalle.
5. Mostrar el tiempo de espera indicado por el servidor si TMDB responde con límite de tasa 429.

## Conclusión

La ficha de detalle centraliza una consulta enriquecida y validada, y organiza la información según la prioridad de lectura. Las tarjetas concentran descubrimiento, navegación y guardado con un contrato reutilizable. Los filtros locales y la cuadrícula compacta de Inicio mejoran la exploración sin aumentar el número de peticiones a TMDB.
