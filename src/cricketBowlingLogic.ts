/** @format */
{
  interface Match {
    id: number;
    opponent: string;
    runs: number;
    overs: number;
    balls: number;
    wickets: number;
  }

  const savedMatches = localStorage.getItem("cricketMatches");
  let seasonMatches: Match[] = savedMatches ? JSON.parse(savedMatches) : [];

  function saveAndRefresh(updatedMatches: Match[]) {
    seasonMatches = updatedMatches;

    localStorage.setItem("cricketMatches", JSON.stringify(seasonMatches));
    localStorage.setItem("lastEntryDate", Date.now().toString());

    const display = document.getElementById("economy-display");
    if (display) display.innerText = getSeasonEconomy(seasonMatches);

    updateHistoryUI(seasonMatches);
  }

  function getBalls(match: Match): number {
    return match.overs * 6 + (match.balls || 0);
  }

  function getSeasonEconomy(matches: Match[]): string {
    const totalRuns = matches.reduce((sum, m) => sum + m.runs, 0);
    const totalBalls = matches.reduce((sum, m) => sum + getBalls(m), 0);
    return totalBalls === 0
      ? "0.00"
      : (totalRuns / (totalBalls / 6)).toFixed(2);
  }

  function updateHistoryUI(matches: Match[]) {
    const list = document.getElementById("history-list");
    if (!list) return;

    list.innerHTML =
      matches.length === 0
        ? `<p class="empty-msg">No matches recorded yet.</p>`
        : "";

    matches.forEach((match) => {
      const matchRow = document.createElement("div");
      matchRow.className = "history-item";
      matchRow.innerHTML = `
        <div class="match-info">
          <strong>vs ${match.opponent}</strong>
          <span>${match.overs}.${match.balls} Overs</span>
        </div>
        <div class="match-stats">
          <span class="runs">${match.runs}r</span>
          <span class="wickets">${match.wickets}w</span>
          <div class="action-buttons">
            <button class="edit-btn" data-id="${match.id}">✎</button>
            <button class="delete-btn" data-id="${match.id}">×</button>
          </div>
        </div>`;
      list.appendChild(matchRow);
    });

    setupActionListeners(matches);
  }

  function setupActionListeners(matches: Match[]) {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = Number(
          (e.currentTarget as HTMLElement).getAttribute("data-id"),
        );
        const confirmed = await showModal(
          "Delete Match",
          "Throw this performance in the bin?",
        );
        if (confirmed) {
          const filtered = matches.filter((m) => m.id !== id);
          saveAndRefresh(filtered);
        }
      });
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number(
          (e.currentTarget as HTMLElement).getAttribute("data-id"),
        );
        prepareEdit(id, matches);
      });
    });
  }

  async function prepareEdit(id: number, matches: Match[]) {
    const confirmed = await showModal("Edit Match", "Move data to form?");
    if (!confirmed) return;

    const match = matches.find((m) => m.id === id);
    if (!match) return;

    (document.getElementById("opp-input") as HTMLInputElement).value =
      match.opponent;
    (document.getElementById("runs-input") as HTMLInputElement).value =
      match.runs.toString();
    (document.getElementById("overs-input") as HTMLInputElement).value =
      match.overs.toString();
    (document.getElementById("balls-input") as HTMLInputElement).value =
      match.balls.toString();
    (document.getElementById("wickets-input") as HTMLInputElement).value =
      match.wickets.toString();

    window.scrollTo({ top: 0, behavior: "smooth" });

    const updated = matches.filter((m) => m.id !== id);
    saveAndRefresh(updated);
  }

  window.addEventListener("DOMContentLoaded", () => {
    saveAndRefresh(seasonMatches);
  });

  const form = document.getElementById("match-form") as HTMLFormElement;
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const newMatchData = {
        opponent: (document.getElementById("opp-input") as HTMLInputElement)
          .value,
        runs: parseInt(
          (document.getElementById("runs-input") as HTMLInputElement).value,
        ),
        overs: parseInt(
          (document.getElementById("overs-input") as HTMLInputElement).value,
        ),
        balls:
          parseInt(
            (document.getElementById("balls-input") as HTMLInputElement).value,
          ) || 0,
        wickets:
          parseInt(
            (document.getElementById("wickets-input") as HTMLInputElement)
              .value,
          ) || 0,
      };

      const newMatch = { ...newMatchData, id: Date.now() };
      const updated = [...seasonMatches, newMatch];
      if (updated.length > 20) updated.shift();

      saveAndRefresh(updated);
      form.reset();
    });
  }

  const clearBtn = document.getElementById("clear-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", async () => {
      const confirmed = await showModal("Clear Season", "Wipe everything?");
      if (confirmed) saveAndRefresh([]);
    });
  }

  function showModal(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const modal = document.getElementById("custom-modal")!;
      const titleEl = document.getElementById("modal-title")!;
      const msgEl = document.getElementById("modal-message")!;
      const confirmBtn = document.getElementById("modal-confirm")!;
      const cancelBtn = document.getElementById("modal-cancel")!;

      titleEl.innerText = title;
      msgEl.innerText = message;
      modal.classList.remove("hidden");

      confirmBtn.onclick = () => {
        modal.classList.add("hidden");
        resolve(true);
      };
      cancelBtn.onclick = () => {
        modal.classList.add("hidden");
        resolve(false);
      };
    });
  }
}
