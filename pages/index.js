import Head from 'next/head'
import Image from 'next/image';
import { Inter } from 'next/font/google'
import styles from '../styles/Home.module.css'
import Banner from "../components/banner"
import Card from "../components/card"
import { fetchCoffeeStores } from '../lib/coffee-store';
import userTrackLocation from '../hooks/track-location';
import { useState, useEffect, useContext } from 'react';
import { ACTION_TYPES, StoreContext } from '../Store/store-context';



export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: { coffeeStores, }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMessage, isFindingLocation } = userTrackLocation(); //destructring 



  //===================================================================================================================
  const [coffeeStoresError, setCoffeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;

  useEffect(() => {
    async function setCoffeeStoreByLocation() {
      if (latLong) {
        try {
          const response = await fetch(`/api/getCoffeeStoreByLocation?latLong=${latLong}&limit=30`);
          const coffeeStores = await response.json();
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores,
            },
          });
          setCoffeStoresError('');
        }
        catch (error) {
          setCoffeStoresError(error.message);
        }
      }
    }
    setCoffeeStoreByLocation();

  }, [latLong,dispatch])

  //===================================================================================================================

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>

      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="discover coffee stores" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner buttonText={isFindingLocation ? "Locating..." : "View store nearby"} handleOnClick={handleOnBannerBtnClick} />

        {locationErrorMessage && <p>Something went wrong : {locationErrorMessage}</p>}
        {coffeeStoresError && <p>Something went wrong : {coffeeStoresError}</p>}

        <div className={styles.heroImage}>

           <Image src="/static/hero-image.png" width={700} height={400} className={styles.hero} alt="hero image"/>
        </div>
        {/* ========================================================================================================================================= */}

        {coffeeStores.length > 0 && (
          <>
            <div className={styles.sectionWrapper}>
              <h2 className={styles.heading2}>Stores Near Me</h2>
              <div className={styles.cardLayout}>

                {coffeeStores.map((coffeeStore) => {
                  return (
                    <Card
                      key={coffeeStore.id}
                      name={coffeeStore.name}
                      imgUrl={coffeeStore.imgUrl || "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"}
                      href={`/coffee-store/${coffeeStore.id}`}
                      className={styles.card}
                    />);


                })}
              </div>
            </div>
          </>
        )}
        {/* ========================================================================================================================================= */}
        {props.coffeeStores.length > 0 && (
          <>
            <div className={styles.sectionWrapper}>
              <h2 className={styles.heading2} style={{ color: "green" }}>Toronto stores</h2>
              <div className={styles.cardLayout}>

                {props.coffeeStores.map((coffeeStore) => {
                  return (
                    <Card
                      key={coffeeStore.id}
                      name={coffeeStore.name}
                      imgUrl={coffeeStore.imgUrl || "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"}
                      href={`/coffee-store/${coffeeStore.id}`}
                      className={styles.card}
                    />);


                })}
              </div>
            </div>
          </>
        )}
      </main>

    </div>
  )
}
