
import { useEffect, useMemo, useState } from "react";
import { roadmap } from "./roadmap";
import "./App.css";

const STORAGE_KEY = "dsa-questions";

const learningOrder = [
  "Foundations",
  "Arrays",
  "Strings",
  "HashMap and HashSet",
  "Two Pointers",
  "Sliding Window",
  "Binary Search",
  "Linked Lists",
  "Stack and Queue",
  "Recursion and Backtracking",
  "Trees and Binary Trees",
  "Heap and Priority Queue",
  "Greedy Algorithms",
  "Dynamic Programming",
  "Graphs",
  "Trie, Union Find and Advanced Graphs",
  "Intervals, Sorting and Matrix",
  "Bit Manipulation and Mathematics",
  "Advanced Design Problems",
];

const orderedRoadmap = learningOrder
  .map((name) => roadmap.find((topic) => topic.name === name))
  .filter(Boolean);

const initialQuestions = orderedRoadmap.flatMap((topic, topicIndex) =>
  topic.questions.map((name, questionIndex) => ({
    id: `${roadmap.indexOf(topic)}-${questionIndex}`,
    topic: topic.name,
    name,
    done: false,
  }))
);

function loadQuestions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialQuestions;

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return initialQuestions;

    return initialQuestions.map((question) => {
      const previous = parsed.find(
        (item) =>
          item.id === question.id ||
          (item.topic === question.topic && item.name === question.name)
      );

      return {
        ...question,
        done: previous ? Boolean(previous.done) : false,
      };
    });
  } catch {
    return initialQuestions;
  }
}

function getStageStats(questions) {
  return orderedRoadmap.map((topic, index) => {
    const topicQuestions = questions.filter(
      (question) => question.topic === topic.name
    );

    const done = topicQuestions.filter((question) => question.done).length;
    const total = topicQuestions.length;

    return {
      ...topic,
      index,
      total,
      done,
      remaining: total - done,
      percentage: total ? Math.round((done / total) * 100) : 0,
      complete: total > 0 && done === total,
    };
  });
}

function App() {
  const [questions, setQuestions] = useState(loadQuestions);
  const [activeTopic, setActiveTopic] = useState(() => {
    const savedQuestions = loadQuestions();
    const firstIncomplete = getStageStats(savedQuestions).find(
      (stage) => !stage.complete
    );
    return firstIncomplete?.name || orderedRoadmap[0]?.name;
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  }, [questions]);

  const stages = useMemo(() => getStageStats(questions), [questions]);

  const completed = questions.filter((question) => question.done).length;
  const total = questions.length;
  const remaining = total - completed;
  const overallProgress = total
    ? Math.round((completed / total) * 100)
    : 0;

  const currentStageIndex = stages.findIndex((stage) => !stage.complete);
  const currentStage = stages[currentStageIndex] || stages[stages.length - 1];
  const selectedStage =
    stages.find((stage) => stage.name === activeTopic) || currentStage;

  const activeQuestions = useMemo(() => {
    if (search.trim()) {
      return questions.filter(
        (question) =>
          question.name.toLowerCase().includes(search.toLowerCase()) ||
          question.topic.toLowerCase().includes(search.toLowerCase())
      );
    }

    return questions.filter(
      (question) => question.topic === activeTopic
    );
  }, [questions, search, activeTopic]);

  function toggleQuestion(id) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === id
          ? { ...question, done: !question.done }
          : question
      )
    );
  }

  function openStage(name) {
    setActiveTopic(name);
    setSearch("");
  }

  function goToCurrentStage() {
    if (currentStage) {
      openStage(currentStage.name);
      document
        .getElementById("stage-detail")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }

  const achievements = [
    { name: "First Problem", target: 1, icon: "✦" },
    { name: "25 Problems", target: 25, icon: "⚡" },
    { name: "50 Problems", target: 50, icon: "◈" },
    { name: "Halfway Hero", target: Math.ceil(total / 2), icon: "◎" },
    { name: "DSA Master", target: total, icon: "♛" },
  ];

  return (
    <div className="journey-app">
      <div className="journey-background" />

      <header className="journey-header">
        <a href="#top" className="journey-brand">
          <span className="brand-logo">D</span>
          <span>
            <strong>DSA MASTERY</strong>
            <small>YOUR CODING JOURNEY</small>
          </span>
        </a>

        <nav className="journey-nav">
          <a href="#journey">Learning path</a>
          <a href="#stage-detail">Current stage</a>
          <a href="#achievements">Achievements</a>
        </nav>

        <div className="header-progress">
          <span className="online-dot" />
          {overallProgress}% COMPLETE
        </div>
      </header>

      <main id="top" className="journey-main">
        <section className="journey-hero">
          <div className="hero-copy">
            <div className="journey-eyebrow">YOUR PERSONAL DSA ROADMAP</div>
            <h1>Start small.<br /><span>Become unstoppable.</span></h1>
            <p>
              A clear, step-by-step path from programming fundamentals
              to advanced problem solving. Follow the stages in order
              and build your skills one concept at a time.
            </p>
            <button className="journey-primary" onClick={goToCurrentStage}>
              Continue learning <span>→</span>
            </button>
          </div>

          <div className="hero-progress-card">
            <div className="hero-card-label">YOUR OVERALL PROGRESS</div>
            <div
              className="progress-orb"
              style={{ "--progress": `${overallProgress}%` }}
            >
              <div className="progress-orb-inner">
                <strong>{overallProgress}%</strong>
                <span>MASTERED</span>
              </div>
            </div>
            <div className="hero-card-numbers">
              <div><strong>{completed}</strong><span>SOLVED</span></div>
              <div><strong>{remaining}</strong><span>LEFT</span></div>
              <div><strong>{stages.filter((stage) => stage.complete).length}/19</strong><span>STAGES</span></div>
            </div>
          </div>
        </section>

        <section className="journey-overview">
          <div className="overview-item">
            <span className="overview-icon">◎</span>
            <div><strong>{total}</strong><small>TOTAL QUESTIONS</small></div>
          </div>
          <div className="overview-item">
            <span className="overview-icon">✓</span>
            <div><strong>{completed}</strong><small>COMPLETED</small></div>
          </div>
          <div className="overview-item">
            <span className="overview-icon">↗</span>
            <div><strong>{stages.filter((stage) => stage.complete).length}</strong><small>STAGES FINISHED</small></div>
          </div>
          <div className="overview-item">
            <span className="overview-icon">◇</span>
            <div><strong>{stages.length}</strong><small>LEARNING STAGES</small></div>
          </div>
        </section>

        <section id="journey" className="learning-section">
          <div className="section-title-row">
            <div>
              <div className="journey-eyebrow">01 / FOLLOW THE PATH</div>
              <h2>Your learning journey</h2>
              <p>Start at Stage 01 and move forward as you master each topic.</p>
            </div>
            <div className="path-key">
              <span><i className="key-current" /> Current</span>
              <span><i className="key-done" /> Completed</span>
              <span><i className="key-next" /> Upcoming</span>
            </div>
          </div>

          <div className="journey-board">
            <div className="path-intro">
              <span className="start-flag">START HERE</span>
              <span className="path-intro-line" />
              <span className="path-intro-text">19 STAGES · BEGINNER TO ADVANCED</span>
            </div>

            <div className="stage-list">
              {stages.map((stage, index) => {
                const isCurrent = index === currentStageIndex;
                const isNext = index === currentStageIndex + 1;
                const isSelected = activeTopic === stage.name;
                const status = stage.complete
                  ? "completed"
                  : isCurrent
                    ? "current"
                    : isNext
                      ? "next"
                      : "upcoming";

                return (
                  <div
                    className={`stage-entry ${status} ${isSelected ? "selected" : ""}`}
                    key={stage.name}
                  >
                    <div className="stage-connector">
                      <div className="stage-node">
                        {stage.complete ? "✓" : String(index + 1).padStart(2, "0")}
                      </div>
                      {index !== stages.length - 1 && (
                        <div className="connector-line" />
                      )}
                    </div>

                    <button
                      className="stage-card"
                      onClick={() => openStage(stage.name)}
                    >
                      <div className="stage-card-icon">{stage.icon}</div>

                      <div className="stage-card-content">
                        <div className="stage-card-topline">
                          <span>STAGE {String(index + 1).padStart(2, "0")}</span>
                          {status === "current" && <b className="status-current">YOU ARE HERE</b>}
                          {status === "completed" && <b className="status-completed">COMPLETED</b>}
                          {status === "next" && <b className="status-next">UP NEXT</b>}
                          {status === "upcoming" && <b className="status-upcoming">UPCOMING</b>}
                        </div>
                        <h3>{stage.name}</h3>
                        <div className="stage-card-bottom">
                          <span>{stage.done} of {stage.total} questions completed</span>
                          <span>{stage.percentage}%</span>
                        </div>
                        <div className="stage-progress">
                          <span style={{ width: `${stage.percentage}%` }} />
                        </div>
                      </div>

                      <div className="stage-card-arrow">→</div>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="finish-flag">
              <span>✦</span>
              <div>
                <strong>YOUR DESTINATION</strong>
                <small>DSA MASTERY ACHIEVED</small>
              </div>
            </div>
          </div>
        </section>

        <section id="stage-detail" className="stage-detail-section">
          <div className="section-title-row">
            <div>
              <div className="journey-eyebrow">02 / STUDY YOUR TOPIC</div>
              <h2>Your selected stage</h2>
              <p>Work through the questions and mark each one when you solve it.</p>
            </div>
          </div>

          <div className="selected-stage-card">
            <div className="selected-stage-heading">
              <div className="selected-stage-icon">{selectedStage?.icon}</div>
              <div className="selected-stage-title">
                <span>STAGE {String((selectedStage?.index ?? 0) + 1).padStart(2, "0")}</span>
                <h3>{selectedStage?.name}</h3>
                <p>
                  {selectedStage?.complete
                    ? "Excellent work! You have completed this stage."
                    : selectedStage?.index === currentStageIndex
                      ? "This is your current stage. Focus on mastering these questions."
                      : "Explore this stage whenever you are ready."}
                </p>
              </div>
              <div className="selected-stage-percent">
                <strong>{selectedStage?.percentage || 0}%</strong>
                <span>COMPLETED</span>
              </div>
            </div>

            <div className="selected-stage-progress">
              <span style={{ width: `${selectedStage?.percentage || 0}%` }} />
            </div>

            <div className="question-toolbar">
              <div>
                <strong>Practice questions</strong>
                <span>{activeQuestions.length} questions</span>
              </div>
              <label className="question-search">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search questions or topics..."
                />
                {search && (
                  <button onClick={() => setSearch("")}>×</button>
                )}
              </label>
            </div>

            <div className="beginner-tip">
              <span>✦</span>
              <p><strong>Beginner tip:</strong> Try solving a question yourself first. After solving it on LeetCode, mark it completed here to track your progress.</p>
            </div>

            <div className="practice-list">
              {activeQuestions.length === 0 ? (
                <div className="no-questions">No matching questions found. Try another search.</div>
              ) : (
                activeQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`practice-row ${question.done ? "practice-done" : ""}`}
                  >
                    <div className="practice-number">{String(index + 1).padStart(2, "0")}</div>
                    <div className="practice-name">
                      <strong>{question.name}</strong>
                      {search && <span>{question.topic}</span>}
                    </div>
                    <button
                      className={`practice-check ${question.done ? "checked" : ""}`}
                      onClick={() => toggleQuestion(question.id)}
                    >
                      <span>{question.done ? "✓" : "+"}</span>
                      {question.done ? "Solved" : "Mark solved"}
                    </button>
                  </div>
                ))
              )}
            </div>

            {selectedStage && (
              <div className="stage-navigation">
                <button
                  className="stage-nav-button"
                  disabled={selectedStage.index === 0}
                  onClick={() => openStage(stages[selectedStage.index - 1].name)}
                >
                  ← Previous stage
                </button>
                <span>STAGE {selectedStage.index + 1} OF {stages.length}</span>
                <button
                  className="stage-nav-button"
                  disabled={selectedStage.index === stages.length - 1}
                  onClick={() => openStage(stages[selectedStage.index + 1].name)}
                >
                  Next stage →
                </button>
              </div>
            )}
          </div>
        </section>

        <section id="achievements" className="achievement-section">
          <div className="section-title-row">
            <div>
              <div className="journey-eyebrow">03 / KEEP GOING</div>
              <h2>Your milestones</h2>
              <p>Celebrate the progress you make along the way.</p>
            </div>
          </div>

          <div className="milestone-grid">
            {achievements.map((achievement) => {
              const unlocked = completed >= achievement.target;
              return (
                <div
                  className={`milestone-card ${unlocked ? "unlocked" : ""}`}
                  key={achievement.name}
                >
                  <span className="milestone-icon">{achievement.icon}</span>
                  <div>
                    <strong>{achievement.name}</strong>
                    <small>{unlocked ? "UNLOCKED" : `${achievement.target} QUESTIONS TO UNLOCK`}</small>
                  </div>
                  <span className="milestone-status">{unlocked ? "✓" : "◇"}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="journey-ending">
          <div className="ending-symbol">✦</div>
          <div>
            <span>KEEP MOVING FORWARD</span>
            <h2>{remaining === 0 ? "You have mastered the roadmap!" : "Your next solution is waiting."}</h2>
            <p>Consistency beats speed. Learn the concept, practice the problem, and move to the next stage.</p>
          </div>
          <button onClick={goToCurrentStage}>Continue journey →</button>
        </section>
      </main>

      <footer className="journey-footer">
        <strong>DSA MASTERY</strong>
        <span>ONE STAGE AT A TIME · ONE PROBLEM AT A TIME</span>
        <span>2026</span>
      </footer>
    </div>
  );
}

export default App;
