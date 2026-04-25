'use client';

import { useMemo, useState } from 'react';
import styles from './page.module.css';

type FormState = {
  contactName: string;
  contactEmail: string;
  projectName: string;
  deadline: string;
  notes: string;
};

const initialState: FormState = {
  contactName: '',
  contactEmail: '',
  projectName: '',
  deadline: '',
  notes: '',
};

type ConfirmClientProps = {
  client: string;
  uploadUrl: string;
};

export default function ConfirmClient({ client, uploadUrl }: ConfirmClientProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [copied, setCopied] = useState(false);

  const handoffTemplate = useMemo(
    () =>
      [
        `Client: ${client}`,
        `Project: ${form.projectName || '[project name]'}`,
        `Contact: ${form.contactName || '[contact name]'}`,
        `Email: ${form.contactEmail || '[contact email]'}`,
        `Deadline: ${form.deadline || '[deadline]'}`,
        `Upload Folder: ${uploadUrl || '[upload url]'}`,
        `Notes: ${form.notes || '[notes]'}`,
      ].join('\n'),
    [client, form, uploadUrl]
  );

  const onFieldChange =
    (key: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
      setCopied(false);
    };

  const copyTemplate = async () => {
    await navigator.clipboard.writeText(handoffTemplate);
    setCopied(true);
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.kicker}>Post-Upload Handoff</p>
        <h1>Confirm your upload for {client}</h1>
        <p>
          Fill this form and copy the generated message into email or Teams so our
          editing team can begin processing.
        </p>
      </header>

      <section className={styles.formCard}>
        <label>
          Contact Name
          <input value={form.contactName} onChange={onFieldChange('contactName')} />
        </label>

        <label>
          Contact Email
          <input value={form.contactEmail} onChange={onFieldChange('contactEmail')} />
        </label>

        <label>
          Project Name
          <input value={form.projectName} onChange={onFieldChange('projectName')} />
        </label>

        <label>
          Deadline
          <input
            type="date"
            value={form.deadline}
            onChange={onFieldChange('deadline')}
          />
        </label>

        <label>
          Notes for Editors
          <textarea rows={4} value={form.notes} onChange={onFieldChange('notes')} />
        </label>
      </section>

      <section className={styles.templateCard}>
        <h2>Handoff Message</h2>
        <pre>{handoffTemplate}</pre>
        <button type="button" onClick={copyTemplate}>
          {copied ? 'Copied' : 'Copy Handoff Message'}
        </button>
      </section>
    </main>
  );
}
