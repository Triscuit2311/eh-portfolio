import Head from 'next/head';
import BasicInfo from '../components/BasicInfo';
import Gallery from '../components/Gallery';
import fs from "fs";
import path from 'path';
import styles from "@/styles/Main.css"

import { useCallback } from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.


export default function Home({ artwork_sets }) {
    const particlesInit = useCallback(async engine => {
        console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        //await loadFull(engine);
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        console.log(container);
    }, []);

    return (
        <div>
            <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                options={{
                    // background: {
                    //     color: {
                    //         value: "#0d47a1",
                    //     },
                    // },
                    fpsLimit: 240,
                    interactivity: {
                        events: {
                            onClick: {
                                enable: true,
                                mode: "push",
                            },
                            // onHover: {
                            //     enable: true,
                            //     mode: "repulse",
                            // },
                            resize: true,
                        },
                        modes: {
                            push: {
                                quantity: 10,
                            },
                            // repulse: {
                            //     distance: 20,
                            //     duration: 0.5,
                            // },
                        },
                    },
                    particles: {
                        color: {
                            value: "#000000",
                        },
                        links: {
                            color: "#000000",
                            distance: 20,
                            enable: true,
                            opacity: 0.2,
                            width: 1,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: {
                                default: "bounce",
                            },
                            random: false,
                            speed: 1,
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 600,
                            },
                            value: 40,
                        },
                        opacity: {
                            value: 0.2,
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            value: { min: 1, max: 3 },
                        },
                    },
                    detectRetina: true,
                }}
            />
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className='main'>
                <div className="artist-name">Eddie Householder</div>
                <div className='gallery-background'>
                    <Gallery artwork_sets={artwork_sets} />
                </div>
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
            const metaDataRaw = fs.readFileSync(metadataPath, { encoding: 'utf-8' });
            const metaData = JSON.parse(metaDataRaw);

            const assetBasePath = path.join("/artwork", metaData[0]['directory']);

            var art_set = { title: metaData[0]['title'], items: [] }

            metaData[0]['items'].forEach(element => {

                if(element['filename'].includes("webm") ){
                    console.log(path.join(assetBasePath, element['filename']));
                }
                
                var art_item = {
                    title: element['name'],
                    description: element['description'],
                    type: element['type'],
                    file: path.join(assetBasePath, element['filename'])
                }
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


