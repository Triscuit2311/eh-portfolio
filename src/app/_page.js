import Head from 'next/head';
import BasicInfo from '../components/BasicInfo';
import Gallery from '../components/Gallery';
import fs from "fs";
import path from "path";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Artist Name - Portfolio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="p-4">
        <h1>Welcome to Artist Name's Portfolio</h1>
      </header>

      <main className="flex-grow p-4">
        <a href="#" className="button">
          Artist Info &rarr;
        </a>
        <BasicInfo />
        <Gallery />
      </main>

      <footer className="p-4">
        Dante Trisciuzzi 2023
      </footer>
    </div>
  )
}


export async function getStaticProps() {
  const artworkDir = path.join(process.cwd(), 'artwork');
  const directories = fs.readdirSync(artworkDir);

  const artworks = directories.map(dir => {
    const fullPath = path.join(artworkDir, dir, 'data.json');
    const content = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(content);
  });

  return {
    props: {
      artworks,
    },
  };
}