import Head from "next/head";

import styles from "@/styles/Home.module.css";
import { useState } from "react";
import { Domains, useData } from "@/services/data";

type Person = {
  fullName: string;
  companyDomain: string | null;
};
interface FormElements extends HTMLFormControlsCollection {
  fullName: HTMLInputElement;
  companyDomain: HTMLInputElement;
}
interface PersonFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function Home() {
  const [person, setPerson] = useState("");
  const [email, setEmail] = useState("");
  const { data } = useData<Domains>("domains");

  const handleSubmit = async (event: React.FormEvent<PersonFormElement>) => {
    event.preventDefault();

    const formData: Person = {
      fullName: event.currentTarget.elements.fullName.value,
      companyDomain: event.currentTarget.elements.companyDomain.value,
    };

    setPerson(formData.fullName);
    const JSONdata = JSON.stringify(formData);

    const endpoint = "http://localhost:3001/email";

    const options = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSONdata,
    };
    const response = await fetch(endpoint, options);
    const result = await response.json();
    setEmail(result.data);
  };
  return (
    <>
      <Head>
        <title>Guess my corporate email</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>What is my company email?</h1>
        <h2 className={styles.description}>
          If we knew the company domain already, we will tell you the best email
          that you can give a try 🤓
        </h2>
        <form action="/email" className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="fullName" className={styles.label}>
            Full name
          </label>
          <input
            autoComplete="off"
            type="text"
            id="fullName"
            name="fullName"
            className={styles.inputText}
            placeholder="E.g.: Ada Lovelace"
            required
            title="Please, provide a full name, for example at least one surname"
            pattern="^\S+\s+\S+$"
          />
          <label htmlFor="companyDomain" className={styles.label}>
            Company domain
          </label>
          <select
            className={styles.dropdownList}
            id="companyDomain"
            name="companyDomain"
            required
          >
            <option value="">Please select one item</option>
            {data?.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
          <button type="submit" className={styles.primaryButton}>
            Search
          </button>
        </form>
        <section className={styles.result}>
          {`For ${person} , the email is probably ${email}`}
        </section>
      </main>
      <footer className={styles.footer}>
        Made with 🧡 by:
        <a href="https://github.com/joseliacosta">joseliacosta</a>
      </footer>
    </>
  );
}
