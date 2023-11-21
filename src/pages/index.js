import Head from 'next/head';
import BasicInfo from '../components/BasicInfo';
import Gallery from '../components/Gallery';
import fs from "fs";
import path from 'path';


export default function Home({ artwork_sets }) {
    return (
        <div>
            <Head>
                {/* <title>Artist Name - Portfolio</title> */}
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <main>
                {/* <h1>Welcome to Artist Name's Portfolio</h1> */}
                <Gallery artwork_sets={artwork_sets} />
            </main>

            <footer>
                Dante Trisciuzzi 2023
            </footer>
        </div>
    );
}

export async function getStaticProps() {

    const artworksDir = path.join(process.cwd(), "artwork");
    const artworkMetadatas = fs.readdirSync(artworksDir);

    var artwork_sets = [

    ]
    for (let index = 0; index < artworkMetadatas.length; index++) {

        try {
            const element = artworkMetadatas[index];
            const metadataPath = path.join(artworksDir, artworkMetadatas[index]);
            const metaDataRaw = fs.readFileSync(metadataPath, {encoding: 'utf-8'});
            const metaData = JSON.parse(metaDataRaw);

            const assetBasePath = path.join("/artwork", metaData[0]['directory']);

            var art_set = {title: metaData[0]['title'], items: []}

            metaData[0]['items'].forEach(element => {
                var art_item = {
                    title: element['name'],
                    description: element['description'],
                    type: element['type'],
                    // <img src="/artwork/golden_gate/gg1.jpg" alt="Static Image" />
                    file: path.join(assetBasePath, element['filename'])
                }
                //console.log(art_item);
                art_set.items.push(art_item);
            });

        } catch (err) {
            console.log("ERR: " + err);
        }
        artwork_sets.push(art_set);
    }

    return {
        props: {
            artwork_sets,
        },
    };
}


