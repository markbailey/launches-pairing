import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';

import mapToJSX from '../utilities/mapToJSX';
import LaunchCard from '../components/Launch';
import SimpleGrid from '../components/SimpleGrid';
import { mount } from '../utilities/show';
import Alert from '../components/Alert';

interface HomeProps {
  preloadData: Launch[];
  apiUrl: string;
}

const { PUBLIC_URL, API_SLUG } = process.env;
const TIMEOUT = 10000;
const MAX_ATTEMPTS = 5;

// This gets called on every request
export async function getServerSideProps() {
  const apiUrl = `${PUBLIC_URL}${API_SLUG}`;
  try {
    const { data } = await axios.get<Launch[]>(apiUrl);
    // Pass data to the page via props
    return { props: { preloadData: data, apiUrl } };
  } catch (error) {
    console.log(error);
    return { props: { preloadData: [], apiUrl } };
  }
}

export default function Home(props: HomeProps) {
  const [attempts, setAttempts] = useState(0);
  const { preloadData, apiUrl } = props;
  const [launches, setLaunches] = useState<Launch[]>(preloadData);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const fetchLaunches = async () => {
    clearTimeout(timeoutRef.current);
    try {
      const { data } = await axios.get<Launch[]>(apiUrl);
      setLaunches(data);
      setAttempts(0);
    } catch (error) {
      setAttempts((value) => value + 1);
    } finally {
      if (attempts < MAX_ATTEMPTS) timeoutRef.current = setTimeout(fetchLaunches, TIMEOUT);
    }
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(fetchLaunches, TIMEOUT);
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <>
      <Head>
        <title>SpaceX Launch API</title>
        <meta name="description" content="An app for rendering top 10 SpaceX launches" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {mount(
        attempts > 0,
        <Alert
          message="Oh no! we are having trouble communicating with the API server, Please check you internet connection."
          severity="danger"
        />
      )}

      <SimpleGrid>
        {({ activeId, setActiveId }) =>
          mapToJSX(launches, (props) => (
            <LaunchCard {...props} showStatus={activeId === props.id} onButtonClick={setActiveId} />
          ))
        }
      </SimpleGrid>
    </>
  );
}
