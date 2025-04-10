import { useState } from "react";
import axios from "axios";
import Logo from "../../assets/logo/pushAndPullLogo.svg";
import "./Login.css";

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({}); // vorherige Fehler zurücksetzen

    try {
      const res = await axios.post(`${apiUrl}/api/login`, {
        emailOrUsername,
        password,
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      const backendErrors = err.response?.data?.errors;

      if (backendErrors) {
        if (!backendErrors.general) {
          backendErrors.general = "Please check the fields.";
        }
        setErrors(backendErrors);
        return;
      }

      setErrors({ general: "Something went wrong. Please try again." });
    }
  };

  const handleRegisterRedirect = () => {
    window.location.href = "/register";
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-page-container">
        <div className="login-form">
          <img className="login-logo" src={Logo} alt="Push&Pull Logo" />
          <p className="slogan">
            Push your limits &<br />
            Pull your potential!
          </p>

          {errors.general && (
            <div className="form-error" role="alert">
              <strong>Oops!</strong> {errors.general}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="text"
                className={errors.emailOrUsername ? "input-error" : ""}
                placeholder="Email or username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
              />
              {errors.emailOrUsername && (
                <small className="error-text">{errors.emailOrUsername}</small>
              )}
            </div>

            <div className="form-group">
              <input
                type="password"
                className={errors.password ? "input-error" : ""}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <small className="error-text">{errors.password}</small>
              )}
            </div>

            <button type="submit">Sign in</button>
          </form>

          <button className="register-button" onClick={handleRegisterRedirect}>
            Not registered yet? Sign up
          </button>
        </div>

        {/* Info-Panel bleibt unverändert */}
        <div className="info-panel">
          <h2>Welcome to Push & Pull – Your Personal Strength Journal</h2>
          <p>
            Push & Pull is more than just a workout tracker – it’s your digital
            gym buddy, accountability partner, and motivation hub all in one.
            Whether you're aiming for your first pull-up or striving to break
            your push-up record, this platform helps you stay consistent and see
            your hard work pay off.
          </p>
          <p>With Push & Pull, you can:</p>
          <ul>
            <li>
              <strong>Log your daily push-ups and pull-ups</strong> with just a
              few clicks – simple, fast, effective.
            </li>
            <li>
              <strong>Track your progress</strong> over time with clean stats
              and visual feedback.
            </li>
            <li>
              <strong>View personal bests</strong> and set new goals to
              challenge yourself week by week.
            </li>
            <li>
              <strong>Explore the community</strong> – see how others are
              progressing and get inspired.
            </li>
            <li>
              <strong>Stay motivated</strong> through consistency,
              accountability, and a growing leaderboard.
            </li>
          </ul>
          <p>
            Whether you train alone or with friends, this is your place to build
            momentum. No fluff, no excuses – just progress. 💪
          </p>
          <p>
            So log in, start tracking, and unleash your potential – one rep at a
            time.
          </p>
        </div>
      </div>
    </div>
  );
}
