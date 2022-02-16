import { MongoClient } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";

import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>NextJs Meetups</title>
        <meta name="description" content="A list of ReactJs Meetups" />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// SSR
/* export async function getServerSideProps(context) {
  const req = context.req;
  const res = context.res;

  return {
    props: {
      meetups: DUMMY_MEETUPS,
    },
  };
} */

// SSG
export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://meetup:QCVh6zsZGESzcbVl@cluster1.9evrc.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10,
  };
}

export default HomePage;
