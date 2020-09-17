import { useMutation, useQuery } from '@apollo/react-hooks';
import { Button, Card, Layout, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import Modal from '../../../components/common/customModal';
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from '../../../components/common/sharedLayout';
import { EnrolmentContext } from '../../../context';
import { CheckError } from '../../../ErrorHandling';
import { FETCH_ENROLMENT_LIMIT, modalItems } from '../../../globalData';
import {
  APPROVE_ENROLMENT_MUTATION,
  REJECT_ENROLMENT_MUTATION,
} from '../../../graphql/mutation';
import { FETCH_ENROLREQUEST_QUERY } from '../../../graphql/query';
import { FetchChecker } from '../../../utils/FetchChecker';
import { LoadingSpin } from '../../../utils/LoadingSpin';
import Enrolment from './Enrolment';

const { Content } = Layout;

export default () => {
  const {
    enrolCount,
    setEnrolCount,
    enrolments,
    fetchedDone,
    loadEnrolments,
    setFetchedDone,
  } = useContext(EnrolmentContext);
  const [visible, SetVisible] = useState(false);
  const [selectedEnrolment, SetSelectedEnrolment] = useState({});
  const [isApprove, SetIsApprove] = useState(false);

  const { data, loading, fetchMore, refetch } = useQuery(
    FETCH_ENROLREQUEST_QUERY,
    {
      onError(err) {
        CheckError(err);
      },
      variables: {
        limit: FETCH_ENROLMENT_LIMIT,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    loadEnrolments(
      data?.getPendingEnrolledCourses.pendingEnrolledCourses || []
    );
    if (data && !data.getPendingEnrolledCourses.hasNextPage)
      setFetchedDone(true);
  }, [data]);

  const [approveEnrolmentCallback, approveEnrolmentStatus] = useMutation(
    APPROVE_ENROLMENT_MUTATION,
    {
      onCompleted: (data) => {
        message.success(data.approveEnrolment);
        setEnrolCount(enrolCount - 1);
      },
      onError(err) {
        SetVisible(false);
        CheckError(err);
      },
    }
  );

  const [rejectEnrolmentCallback, rejectEnrolmentStatus] = useMutation(
    REJECT_ENROLMENT_MUTATION,
    {
      onCompleted: (data) => {
        message.success(data.rejectEnrolment);
        setEnrolCount(enrolCount - 1);
      },
      onError(err) {
        SetVisible(false);
        CheckError(err);
      },
    }
  );

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
        if (!fetchMoreResult.getPendingEnrolledCourses.hasNextPage) {
          setFetchedDone(true);
        }

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

  const handleApproveRejectButton = (enrolment, pressed) => {
    SetVisible(true);
    SetSelectedEnrolment(enrolment);
    if (pressed === 'approved') {
      SetIsApprove(true);
    } else if (pressed === 'rejected') {
      SetIsApprove(false);
    }
  };

  const handleCancel = () => {
    SetVisible(false);
  };

  const handleOk = () => {
    if (isApprove) {
      approveEnrolmentCallback({
        update() {
          SetVisible(false);
          //refresh window to avoid error
          window.location.reload();
        },
        variables: { id: selectedEnrolment._id },
      });
    } else {
      rejectEnrolmentCallback({
        update() {
          SetVisible(false);
          refetch();
        },
        variables: { id: selectedEnrolment._id },
      });
    }
  };

  return (
    <Layout className='layout'>
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb
          titleList={[{ name: 'Enrol Request', link: '/enrolrequest' }]}
        />

        <Content>
          <Card>
            {enrolments.length !== 0 && (
              <p>Please approve or reject the following enrolments</p>
            )}
            {enrolments.map((enrolment) => (
              <Enrolment
                key={enrolment._id}
                enrolment={enrolment}
                handleApproveRejectButton={handleApproveRejectButton}
              />
            ))}

            <LoadingSpin loading={loading} />

            {/*give text of fetch result*/}
            <FetchChecker
              loading={loading}
              payload={enrolments}
              fetchedDone={fetchedDone}
              allLoadedMessage='All Enrolment Request Loaded'
              noItemMessage='No Enrolment Request...'
              handleFetchMore={handleFetchMore}
            />

            {/*modal backdrop*/}
            <Modal
              title={
                isApprove
                  ? modalItems.enrolment.action.approve + ' Enrolment'
                  : modalItems.enrolment.action.reject + ' Enrolment'
              }
              action={
                isApprove
                  ? modalItems.enrolment.action.approve
                  : modalItems.enrolment.action.reject
              }
              itemType={modalItems.enrolment.name}
              visible={visible}
              loading={
                approveEnrolmentStatus.loading || rejectEnrolmentStatus.loading
              }
              handleOk={handleOk}
              handleCancel={handleCancel}
              payload={selectedEnrolment}
            />
          </Card>
        </Content>

        <Footer />
      </Layout>
    </Layout>
  );
};
