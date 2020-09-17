import { useQuery } from '@apollo/react-hooks';
import { Card, Layout } from 'antd';
import React, { useContext, useEffect } from 'react';
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from '../../../components/common/sharedLayout';
import { EnrolmentContext } from '../../../context';
import { CheckError } from '../../../ErrorHandling';
import { FETCH_ENROLMENT_LIMIT } from '../../../globalData';
import { FETCH_ENROLPENDING_QUERY } from '../../../graphql/query';
import { FetchChecker } from '../../../utils/FetchChecker';
import { LoadingSpin } from '../../../utils/LoadingSpin';
import Enrolment from './Enrolment';
const { Content } = Layout;

export default () => {
  const {
    enrolments,
    loadEnrolments,
    fetchedDone,
    setFetchedDone,
  } = useContext(EnrolmentContext);
  const { loading, fetchMore, data } = useQuery(FETCH_ENROLPENDING_QUERY, {
    onError(err) {
      CheckError(err);
    },
    variables: {
      limit: FETCH_ENROLMENT_LIMIT,
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    loadEnrolments(
      data?.getPendingEnrolledCourses.pendingEnrolledCourses || []
    );
    if (data && !data.getPendingEnrolledCourses.hasNextPage) {
      setFetchedDone(true);
    }
  }, [data]);

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        limit: FETCH_ENROLMENT_LIMIT,
        cursor: enrolments[enrolments.length - 1]._id,
      },
      onError(err) {
        CheckError(err);
      },
      updateQuery: (pv, { fetchMoreResult }) => {
        return {
          getPendingEnrolledCourses: {
            __typename: 'pendingEnrolledCourses',
            pendingEnrolledCourses: [
              ...pv.getPendingEnrolledCourses.pendingEnrolledCourses,
              ...fetchMoreResult.getPendingEnrolledCourses
                .pendingEnrolledCourses,
            ],
            hasNextPage: fetchMoreResult.getPendingEnrolledCourses.hasNextPage,
          },
        };
      },
    });
  };
  return (
    <Layout className='layout'>
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb
          titleList={[{ name: 'Enrol Pending', link: '/enrolpending' }]}
        />

        <Content>
          <Card>
            <LoadingSpin loading={loading} />
            {enrolments.map((enrolment) => (
              <Enrolment key={enrolment._id} enrolment={enrolment} />
            ))}

            {/*give text of fetch result*/}
            <FetchChecker
              loading={loading}
              payload={enrolments}
              fetchedDone={fetchedDone}
              allLoadedMessage='All Enrolment Loaded'
              noItemMessage='No Enrolment...'
              handleFetchMore={handleFetchMore}
            />
          </Card>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
