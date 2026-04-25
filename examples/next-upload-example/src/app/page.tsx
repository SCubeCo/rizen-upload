import Link from 'next/link';
import styles from './page.module.css';

type UploadTarget = {
  key: string;
  clientName: string;
  uploadUrl: string;
};

const fallbackTargets: UploadTarget[] = [
  {
    key: 'client-a',
    clientName: 'Client-A',
    uploadUrl:
      'https://scubedigital.sharepoint.com/sites/ClientUploads/Shared%20Documents/Clients/Client-A/Incoming',
  },
];

function getUploadTargets(): UploadTarget[] {
  const raw = process.env.NEXT_PUBLIC_UPLOAD_TARGETS_JSON;

  if (!raw) {
    return fallbackTargets;
  }

  try {
    const parsed = JSON.parse(raw) as UploadTarget[];
    const valid = parsed.filter(
      (item) => item?.clientName && item?.uploadUrl && item?.key
    );

    return valid.length > 0 ? valid : fallbackTargets;
  } catch {
    return fallbackTargets;
  }
}

export default function Home() {
  const targets = getUploadTargets();

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <p className={styles.kicker}>Client Media Intake</p>
        <h1>Upload your files for editing</h1>
        <p className={styles.subtitle}>
          Use your client upload link to send media files to our production team.
          Once upload is complete, submit the handoff form so we can start work.
        </p>
      </header>

      <section className={styles.cards}>
        {targets.map((target) => {
          const confirmHref = `/confirm?client=${encodeURIComponent(target.clientName)}&uploadUrl=${encodeURIComponent(target.uploadUrl)}`;

          return (
            <article key={target.key} className={styles.card}>
              <h2>{target.clientName}</h2>
              <p>
                Upload destination: <strong>Incoming</strong>
              </p>
              <div className={styles.actions}>
                <a
                  className={styles.primaryButton}
                  href={target.uploadUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Upload Link
                </a>
                <Link className={styles.secondaryButton} href={confirmHref}>
                  I Finished Uploading
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section className={styles.guide}>
        <h3>Before You Upload</h3>
        <ul>
          <li>Upload only files related to your project.</li>
          <li>Keep original file names where possible.</li>
          <li>Large uploads may take several minutes to process.</li>
          <li>
            After upload, return to this page and use "I Finished Uploading" so
            our team is notified.
          </li>
        </ul>
      </section>
    </main>
  );
}
