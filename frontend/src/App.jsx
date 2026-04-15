import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const API_URL = 'http://localhost:8000/api';

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'exam', 'result'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [session, setSession] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  // Timer logic
  useEffect(() => {
    let timer;
    if (view === 'exam' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && view === 'exam') {
      submitTest(true);
    }
    return () => clearInterval(timer);
  }, [view, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };


  // Start the test
  const startTest = async () => {
    setLoading(true);
    try {
      // 1. Create a session (User ID 1 is placeholder)
      const sessionRes = await fetch(`${API_URL}/tests/start/1?user_id=1`, { method: 'POST' });
      const sessionData = await sessionRes.json();
      setSession(sessionData);

      // 2. Get questions for Test 1
      const questionsRes = await fetch(`${API_URL}/tests/1/questions`);
      const questionsData = await questionsRes.json();
      setQuestions(questionsData);
      setTimeLeft(600); // 10 minutes
      setView('exam');

    } catch (error) {
      console.error("Failed to start test:", error);
      alert("Error connecting to server. Make sure the backend is running!");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, selectedIndex) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.question_id === questionId);

    if (existingIndex > -1) {
      newAnswers[existingIndex].selected_index = selectedIndex;
    } else {
      newAnswers.push({ question_id: questionId, selected_index: selectedIndex });
    }
    setAnswers(newAnswers);
  };

  const submitTest = async (isAutoSubmitting = false) => {
    if (loading) return;

    // Only ask for confirmation if manually submitting
    if (!isAutoSubmitting) {
      const confirmSubmit = window.confirm("Are you sure you want to submit your exam now?");
      if (!confirmSubmit) return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tests/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.id,
          answers: answers
        })
      });
      const data = await res.json();
      setResult(data);
      setView('result');
    } catch (error) {
      console.error("Failed to submit test:", error);
      alert("Submission failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const [examineeNumber, setExamineeNumber] = useState('');
  const [examineeName, setExamineeName] = useState('');

  if (view === 'landing') {
    return (
      <div className="landing-container">
        <div className="booklet-cover">
          <header className="cover-header">
            <div className="corner-left">Language Knowledge <span style={{ fontSize: '0.8rem' }}>(Vocabulary)</span></div>
            <div className="corner-right" style={{ fontSize: '1.5rem' }}>もんだいようし</div>
          </header>

          <main className="cover-title-group">
            <h1 className="cover-n-level">N5</h1>
            <div className="cover-jp-title">げんごちしき <span style={{ fontSize: '1.2rem' }}>(もじ・ごい)</span></div>
            <div className="cover-time">(25ふん)</div>

            <div className="notes-box">
              <h2>ちゅうい</h2>
              <span className="notes-sub">Notes</span>
              <ul className="notes-list">
                <li>
                  <span className="note-num">1.</span>
                  <span className="note-jp">しけんが　はじまるまで、この　もんだいようしを　あけないで　ください。</span>
                  <span className="note-en">Do not open this question booklet until the test begins.</span>
                </li>
                <li>
                  <span className="note-num">2.</span>
                  <span className="note-jp">この　もんだいようしを　もって　かえる　ことは　できません。</span>
                  <span className="note-en">Do not take this question booklet with you after the test.</span>
                </li>
                <li>
                  <span className="note-num">3.</span>
                  <span className="note-jp">じゅけんばんごうと　なまえを　したの　らんに、じゅけんひょうと　おなじように　かいて　ください。</span>
                  <span className="note-en">Write your examinee registration number and name clearly in each box below as written on your test voucher.</span>
                </li>
                <li>
                  <span className="note-num">4.</span>
                  <span className="note-jp">この　もんだいようしは　ぜんぶで　８ページ　あります。</span>
                  <span className="note-en">This question booklet has 8 pages.</span>
                </li>
                <li>
                  <span className="note-num">5.</span>
                  <span className="note-jp">もんだいには　かいとうばんごうの　<span className="note-box-inline">1</span>、<span className="note-box-inline">2</span>、<span className="note-box-inline">3</span> …　が　あります。かいとうは、かいとうようしに　ある　おなじ　ばんごうの　ところに　マークして　ください。</span>
                  <span className="note-en">One of the row numbers 1, 2, 3 ... is given for each question. Mark your answer in the same row of the answer sheet.</span>
                </li>
              </ul>
            </div>

            <div className="examinee-fields">
              <div className="field-row">
                <div className="field-label">
                  <span className="label-jp">じゅけんばんごう</span>
                  <span className="label-en">Examinee Registration Number</span>
                </div>
                <div className="field-input">
                  <input
                    type="text"
                    value={examineeNumber}
                    onChange={(e) => setExamineeNumber(e.target.value)}
                    placeholder="12345678"
                  />
                </div>
              </div>
              <div className="field-row">
                <div className="field-label">
                  <span className="label-jp">なまえ</span>
                  <span className="label-en">Name</span>
                </div>
                <div className="field-input">
                  <input
                    type="text"
                    value={examineeName}
                    onChange={(e) => setExamineeName(e.target.value)}
                    placeholder="JAPANESE LEARNER"
                  />
                </div>
              </div>
            </div>
          </main>

          <footer className="cover-footer">
            <div className="page-num-circle">3</div>
          </footer>
        </div>

        <div className="start-test-action">
          <button className="start-btn" onClick={startTest} disabled={loading}>
            {loading ? 'Initializing...' : 'Start Mock Test'}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'exam') {
    const question = questions[currentIndex];
    const currentAnswer = answers.find(a => a.question_id === question.id);//
    return (
      <div className="exam-container">
        <div className="exam-header">
          <div className="progress-info">
            <span>QUESTION {currentIndex + 1} OF {questions.length}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
            </div>
          </div>

          <div className={`timer-display ${timeLeft < 60 ? 'timer-urgent' : ''}`}>
            <span className="timer-icon">⏱️</span>
            <span className="timer-text">{formatTime(timeLeft)}</span>
          </div>

          <button className="submit-early-btn" onClick={submitTest}>Final Submit</button>

        </div>

        <main className="question-area">
          <div className="mondai-label">{question.type}</div>

          {question.audio_url && (
            <div className="audio-section">
              <p>🔊 Listening Focus: Click play to hear the question.</p>
              <audio controls src={question.audio_url} className="custom-audio">
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <div className="question-content">
            <h2 className="question-text">
              {question.question_text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </h2>

            {question.image_url && (
              <div className="question-image">
                <img src={question.image_url} alt="Question context" />
              </div>
            )}

            <div className="options-grid">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  className={`option-card ${currentAnswer?.selected_index === idx ? 'selected' : ''}`}
                  onClick={() => handleAnswer(question.id, idx)}
                >
                  <span className="option-num">{idx + 1}</span>
                  <span className="option-val">{option}</span>
                </button>
              ))}
            </div>
          </div>
        </main>

        <footer className="nav-footer">
          <button onClick={prevQuestion} disabled={currentIndex === 0}>Previous</button>
          {currentIndex === questions.length - 1 ? (
            <button className="submit-btn" onClick={submitTest} disabled={loading}>
              {loading ? 'Submitting...' : 'Finish & See Results'}
            </button>
          ) : (
            <button onClick={nextQuestion}>Next Question</button>
          )}
        </footer>
      </div>
    );
  }

  if (view === 'result') {
    return (
      <div className="result-container">
        <div className="result-card">
          <div className="result-icon">🎯</div>
          <h1>Test Completed!</h1>
          <div className="score-display">
            <div className="score-main">{result.score_percentage}%</div>
            <div className="score-sub">{result.correct_answers} Correct / {result.total_questions} Total</div>
          </div>

          <div className="grade-box">
            {result.score_percentage >= 60 ? (
              <p className="pass">合格 (PASS!)</p>
            ) : (
              <p className="fail">不合格 (Keep studying!)</p>
            )}
          </div>

          <div className="section-analysis">
            <h3>Detailed Analysis</h3>
            {result.section_scores && Object.values(result.section_scores).map((section, idx) => (
              <div key={idx} className="section-result-item">
                <div className="section-name">{section.name}</div>
                <div className="section-bar-container">
                  <div
                    className="section-bar-fill"
                    style={{
                      width: `${(section.correct / section.total) * 100}%`,
                      backgroundColor: (section.correct / section.total) >= 0.6 ? '#10b981' : '#ef4444'
                    }}
                  ></div>
                </div>
                <div className="section-numbers">
                  {section.correct} / {section.total}
                </div>
              </div>
            ))}
          </div>

          <button className="restart-btn" onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
