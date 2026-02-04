import { useEffect, useState } from "react";
import {
  fetchDecisions as fetchDecisionsAPI,
  createDecision as createDecisionAPI,
  deleteDecision as deleteDecisionAPI,
  fetchOptions as fetchOptionsAPI,
  addOption as addOptionAPI,
  // deleteOption as deleteOptionAPI,
} from "./api/client";
import "./style/Root.css";

function App() {
  const [decisions, setDecisions] = useState([]);
  const [selectedDecision, setSelectedDecision] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [optionText, setOptionText] = useState("");
  const [options, setOptions] = useState([]);

  /* -------------------- Decisions -------------------- */
  const fetchDecisions = async () => {
    try {
      const res = await fetchDecisionsAPI();
      setDecisions(res.data);
    } catch (err) {
      console.error("Failed to fetch decisions", err);
    }
  };

  const createDecision = async () => {
    if (!title) return;
    try {
      await createDecisionAPI({ title, description });
      setTitle("");
      setDescription("");
      fetchDecisions();
    } catch (err) {
      console.error("Failed to create decision", err);
    }
  };

  const deleteDecision = async (id) => {
    try {
      await deleteDecisionAPI(id);
      if (selectedDecision?.id === id) setSelectedDecision(null);
      fetchDecisions();
    } catch (err) {
      console.error("Failed to delete decision", err);
    }
  };

  /* -------------------- Options -------------------- */
  const fetchOptions = async (decisionId) => {
    try {
      const res = await fetchOptionsAPI(decisionId);
      setOptions(res.data);
    } catch (err) {
      console.error("Failed to fetch options", err);
    }
  };

  const addOption = async () => {
    if (!optionText || !selectedDecision) return;
    try {
      await addOptionAPI({
        decision_id: selectedDecision.id,
        option_text: optionText,
      });
      setOptionText("");
      fetchOptions(selectedDecision.id);
    } catch (err) {
      console.error("Failed to add option", err);
    }
  };

  // const deleteOption = async (id) => {
  //   try {
  //     await deleteOptionAPI(id);
  //     fetchOptions(selectedDecision.id);
  //   } catch (err) {
  //     console.error("Failed to delete option", err);
  //   }
  // };

  /* -------------------- Effects -------------------- */
  useEffect(() => {
    fetchDecisions();
  }, []);

  /* -------------------- UI -------------------- */
  return (
    <main style={{ padding: "2rem", maxWidth: 600, margin: "auto" }}>
      <h1>Decision Maker</h1>

      {/* Create Decision */}
      <section>
        <h2>Create Decision</h2>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <button onClick={createDecision}>Create</button>
      </section>

      <hr />

      {/* List Decisions */}
      <section>
        <h2>Your Decisions</h2>
        {decisions.map((d) => (
          <div
            key={d.id}
            style={{
              padding: "0.5rem",
              cursor: "pointer",
              background: selectedDecision?.id === d.id ? "#ddd" : "transparent",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div onClick={() => {
              setSelectedDecision(d);
              fetchOptions(d.id);
            }}>
              <strong>{d.title}</strong>
            </div>
            <button
              style={{ background: "red", color: "#fff", border: "none", padding: "0.2rem 0.5rem" }}
              onClick={() => deleteDecision(d.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </section>

      {/* Options */}
      {selectedDecision && (
        <>
          <hr />
          <section>
            <h2>Options for: {selectedDecision.title}</h2>

            <input
              placeholder="New option"
              value={optionText}
              onChange={(e) => setOptionText(e.target.value)}
            />
            <button onClick={addOption}>Add Option</button>

            <ul>
              {options.map((opt) => (
                <li key={opt.id} style={{ display: "flex", justifyContent: "space-between" }}>
                  {opt.option_text}
                  {/* <button
                    style={{ background: "red", color: "#fff", border: "none", padding: "0.1rem 0.5rem" }}
                    onClick={() => deleteOption(opt.id)}
                  >
                    Delete
                  </button> */}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}

export default App;
