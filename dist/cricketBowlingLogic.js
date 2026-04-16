"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @format */
{
    const savedMatches = localStorage.getItem("cricketMatches");
    let seasonMatches = savedMatches ? JSON.parse(savedMatches) : [];
    function saveAndRefresh(updatedMatches) {
        seasonMatches = updatedMatches;
        localStorage.setItem("cricketMatches", JSON.stringify(seasonMatches));
        localStorage.setItem("lastEntryDate", Date.now().toString());
        const display = document.getElementById("economy-display");
        if (display)
            display.innerText = getSeasonEconomy(seasonMatches);
        updateHistoryUI(seasonMatches);
    }
    function getBalls(match) {
        return match.overs * 6 + (match.balls || 0);
    }
    function getSeasonEconomy(matches) {
        const totalRuns = matches.reduce((sum, m) => sum + m.runs, 0);
        const totalBalls = matches.reduce((sum, m) => sum + getBalls(m), 0);
        return totalBalls === 0
            ? "0.00"
            : (totalRuns / (totalBalls / 6)).toFixed(2);
    }
    function updateHistoryUI(matches) {
        const list = document.getElementById("history-list");
        if (!list)
            return;
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
    function setupActionListeners(matches) {
        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                const id = Number(e.currentTarget.getAttribute("data-id"));
                const confirmed = yield showModal("Delete Match", "Throw this performance in the bin?");
                if (confirmed) {
                    const filtered = matches.filter((m) => m.id !== id);
                    saveAndRefresh(filtered);
                }
            }));
        });
        document.querySelectorAll(".edit-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const id = Number(e.currentTarget.getAttribute("data-id"));
                prepareEdit(id, matches);
            });
        });
    }
    function prepareEdit(id, matches) {
        return __awaiter(this, void 0, void 0, function* () {
            const confirmed = yield showModal("Edit Match", "Move data to form?");
            if (!confirmed)
                return;
            const match = matches.find((m) => m.id === id);
            if (!match)
                return;
            document.getElementById("opp-input").value =
                match.opponent;
            document.getElementById("runs-input").value =
                match.runs.toString();
            document.getElementById("overs-input").value =
                match.overs.toString();
            document.getElementById("balls-input").value =
                match.balls.toString();
            document.getElementById("wickets-input").value =
                match.wickets.toString();
            window.scrollTo({ top: 0, behavior: "smooth" });
            const updated = matches.filter((m) => m.id !== id);
            saveAndRefresh(updated);
        });
    }
    window.addEventListener("DOMContentLoaded", () => {
        saveAndRefresh(seasonMatches);
    });
    const form = document.getElementById("match-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const newMatchData = {
                opponent: document.getElementById("opp-input")
                    .value,
                runs: parseInt(document.getElementById("runs-input").value),
                overs: parseInt(document.getElementById("overs-input").value),
                balls: parseInt(document.getElementById("balls-input").value) || 0,
                wickets: parseInt(document.getElementById("wickets-input")
                    .value) || 0,
            };
            const newMatch = Object.assign(Object.assign({}, newMatchData), { id: Date.now() });
            const updated = [...seasonMatches, newMatch];
            if (updated.length > 20)
                updated.shift();
            saveAndRefresh(updated);
            form.reset();
        });
    }
    const clearBtn = document.getElementById("clear-btn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
            const confirmed = yield showModal("Clear Season", "Wipe everything?");
            if (confirmed)
                saveAndRefresh([]);
        }));
    }
    function showModal(title, message) {
        return new Promise((resolve) => {
            const modal = document.getElementById("custom-modal");
            const titleEl = document.getElementById("modal-title");
            const msgEl = document.getElementById("modal-message");
            const confirmBtn = document.getElementById("modal-confirm");
            const cancelBtn = document.getElementById("modal-cancel");
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
