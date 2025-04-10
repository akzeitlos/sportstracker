import React, { useState } from 'react';
import './Impressum.css';

export default function Impressum() {
  const [language, setLanguage] = useState("de");

  return (
    <div className="impressum-container">
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

      {/* Deutsches Impressum */}
      {language === "de" && (
        <div>
          <h1>Impressum</h1>

          <section>
            <h2>Angaben gemäß § 5 TMG</h2>
            <p>
              <strong>Push&amp;Pull</strong><br />
              Andreas Krüger<br />
              Leipziger Straße 132<br />
              04442 Zwenkau<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2>Kontakt</h2>
            <p>
              E-Mail: <a href="mailto:kontakt@creative-codes.de">kontakt@creative-codes.de</a>
            </p>
          </section>

          <section>
            <h2>Vertretungsberechtigte</h2>
            <p>Andreas Krüger (Einzelperson)</p>
          </section>

          <section>
            <h2>Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine entsprechende Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h2>Haftung für Links</h2>
            <p>
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </section>

          <section>
            <h2>Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h2>Bildnachweise</h2>
            <p>
              Einige Illustrationen stammen von <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer">Freepik</a>.
            </p>
          </section>
        </div>
      )}

      {/* Englisches Impressum */}
      {language === "en" && (
        <div>
          <h1>Legal Disclosure</h1>

          <section>
            <h2>Information in accordance with Section 5 TMG</h2>
            <p>
              <strong>Push&amp;Pull</strong><br />
              Andreas Krüger<br />
              Leipziger Straße 132<br />
              04442 Zwenkau<br />
              Germany
            </p>
          </section>

          <section>
            <h2>Contact Information</h2>
            <p>
              Email: <a href="mailto:kontakt@creative-codes.de">kontakt@creative-codes.de</a>
            </p>
          </section>

          <section>
            <h2>Representative</h2>
            <p>Andreas Krüger (private individual)</p>
          </section>

          <section>
            <h2>Accountability for Content</h2>
            <p>
              As service providers, we are liable for our own content on these websites according to § 7 (1) TMG. However, according to §§ 8 to 10 TMG, we are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity. Obligations to remove or block the use of information remain unaffected. Any liability in this regard is only possible from the time we become aware of a specific infringement. We will remove such content immediately upon becoming aware of any violations.
            </p>
          </section>

          <section>
            <h2>Accountability for Links</h2>
            <p>
              Our offer contains links to external websites of third parties, whose content we cannot influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the contents of the linked pages. At the time of linking, these pages were checked for possible legal violations. Illegal content was not recognizable at that time. However, permanent monitoring of the linked pages is not reasonable without specific indications of a legal violation. Upon becoming aware of any such violations, we will remove such links immediately.
            </p>
          </section>

          <section>
            <h2>Copyright</h2>
            <p>
              The content and works on these websites created by the site operators are subject to German copyright law. The duplication, editing, distribution, or any kind of exploitation outside the limits of copyright law require the written consent of the respective author or creator. Downloads and copies of this site are only permitted for private, non-commercial use. Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. Should you become aware of a copyright infringement, please notify us accordingly. Upon becoming aware of violations, we will remove such content immediately.
            </p>
          </section>

          <section>
            <h2>Image Credits</h2>
            <p>
              Some illustrations used are from <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer">Freepik</a>.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
