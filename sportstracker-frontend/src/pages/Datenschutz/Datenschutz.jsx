import React, { useState } from 'react';
import './Datenschutz.css';

export default function Datenschutz() {
  const [language, setLanguage] = useState("en");

  return (
    <div class="datenschutz-wrapper">
    <div className="datenschutz-container">
      {/* Sprachumschalter */}
      <div className="language-toggle">
        <button
          onClick={() => setLanguage("en")}
          className={language === "en" ? "active" : ""}
        >
          English
        </button>
        <button
          onClick={() => setLanguage("de")}
          className={language === "de" ? "active" : ""}
        >
          Deutsch
        </button>
      </div>

      {/* Deutsch */}
      {language === "de" && (
        <div>
          <h1>Datenschutzerklärung</h1>

          <section>
            <h2>Verantwortlicher</h2>
            <p>
              Andreas Krüger<br />
              Leipziger Straße 132<br />
              04442 Zwenkau<br />
              kontakt@creative-codes.de
            </p>
          </section>

          <section>
            <h2>Erhebung und Verarbeitung personenbezogener Daten</h2>
            <p>
              Beim Registrieren eines Benutzerkontos erfassen wir folgende Daten:
            </p>
            <ul>
              <li>Vorname und Nachname</li>
              <li>Nutzername</li>
              <li>E-Mail-Adresse</li>
              <li>Passwort (verschlüsselt)</li>
            </ul>
            <p>
              Darüber hinaus erfassen wir Trainingsdaten wie die Anzahl an Push-ups und Pull-ups, die Sie eintragen.
              Diese Daten können aggregiert in Statistiken oder öffentlichen Leaderboards angezeigt werden.
            </p>
          </section>

          <section>
            <h2>Rechtsgrundlage</h2>
            <p>
              Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO zur Durchführung vorvertraglicher Maßnahmen sowie zur Erfüllung eines Vertrags.
            </p>
          </section>

          <section>
            <h2>Speicherdauer</h2>
            <p>
              Ihre Daten werden gespeichert, solange Ihr Benutzerkonto besteht. Bei Löschung des Kontos werden alle personenbezogenen Daten gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
            </p>
          </section>

          <section>
            <h2>Rechte der betroffenen Personen</h2>
            <ul>
              <li>Auskunft über die gespeicherten Daten</li>
              <li>Berichtigung unrichtiger Daten</li>
              <li>Löschung, Einschränkung der Verarbeitung</li>
              <li>Widerspruch gegen die Verarbeitung</li>
              <li>Datenübertragbarkeit</li>
              <li>Beschwerderecht bei einer Aufsichtsbehörde</li>
            </ul>
          </section>

          <section>
            <h2>Kontakt</h2>
            <p>
              Bei Fragen zum Datenschutz wenden Sie sich bitte an: <a href="mailto:kontakt@creative-codes.de">kontakt@creative-codes.de</a>
            </p>
          </section>
        </div>
      )}

      {/* Englisch */}
      {language === "en" && (
        <div>
          <h1>Privacy Policy</h1>

          <section>
            <h2>Responsible party</h2>
            <p>
              Andreas Krüger<br />
              Leipziger Straße 132<br />
              04442 Zwenkau<br />
              kontakt@creative-codes.de
            </p>
          </section>

          <section>
            <h2>Data collection and processing</h2>
            <p>
              When you create an account, we collect the following data:
            </p>
            <ul>
              <li>First and last name</li>
              <li>Username</li>
              <li>Email address</li>
              <li>Password (encrypted)</li>
            </ul>
            <p>
              We also collect training data such as the number of push-ups and pull-ups you log.
              This data may be shown in public statistics or leaderboards.
            </p>
          </section>

          <section>
            <h2>Legal basis</h2>
            <p>
              The data is processed according to Art. 6(1)(b) GDPR for the performance of a contract or pre-contractual measures.
            </p>
          </section>

          <section>
            <h2>Storage period</h2>
            <p>
              Your data is stored as long as your account exists. Upon deletion of your account, all personal data will be erased unless retention is required by law.
            </p>
          </section>

          <section>
            <h2>Your rights</h2>
            <ul>
              <li>Access to your stored data</li>
              <li>Correction of incorrect data</li>
              <li>Deletion or restriction of processing</li>
              <li>Objection to processing</li>
              <li>Data portability</li>
              <li>Right to file a complaint with a supervisory authority</li>
            </ul>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              For any privacy-related concerns, please contact: <a href="mailto:kontakt@creative-codes.de">kontakt@creative-codes.de</a>
            </p>
          </section>
        </div>
      )}
    </div>
    </div>
  );
}
