import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CinetecaProvider, useCineteca } from "./CinetecaProvider";
import { describe, it, expect, beforeEach } from "vitest";
import type { MovieSummary } from "../../domain/movie/movie-summary";

const dummyMovie: MovieSummary = {
  id: 1,
  title: "Test Movie",
  posterUrl: null,
  releaseStatus: { kind: "unknown" },
};

function TestComponent() {
  const cineteca = useCineteca();

  return (
    <div>
      <div data-testid="saved-count">
        {Object.keys(cineteca.state.savedMovies).length}
      </div>
      <div data-testid="list-count">{cineteca.state.lists.length}</div>
      <button
        onClick={() => {
          cineteca.saveMovie(dummyMovie);
        }}
      >
        Save Movie
      </button>
      <button
        onClick={() => {
          cineteca.createList("My List");
        }}
      >
        Create List
      </button>
    </div>
  );
}

describe("CinetecaProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("provides empty initial state", () => {
    render(
      <CinetecaProvider>
        <TestComponent />
      </CinetecaProvider>,
    );

    expect(screen.getByTestId("saved-count").textContent).toBe("0");
    expect(screen.getByTestId("list-count").textContent).toBe("0");
  });

  it("updates state when saveMovie is called", async () => {
    const user = userEvent.setup();
    render(
      <CinetecaProvider>
        <TestComponent />
      </CinetecaProvider>,
    );

    await user.click(screen.getByText("Save Movie"));
    expect(screen.getByTestId("saved-count").textContent).toBe("1");
  });

  it("updates state when createList is called", async () => {
    const user = userEvent.setup();
    render(
      <CinetecaProvider>
        <TestComponent />
      </CinetecaProvider>,
    );

    await user.click(screen.getByText("Create List"));
    expect(screen.getByTestId("list-count").textContent).toBe("1");
  });
});
