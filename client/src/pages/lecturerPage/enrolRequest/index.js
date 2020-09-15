import { useMutation, useQuery } from "@apollo/react-hooks";
import { Button, Card, Layout, message, Modal, Spin } from "antd";
import React, { useContext, useState, useEffect } from "react";
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from "../../../components/common/sharedLayout";
import { CourseContext, EnrolmentContext } from "../../../context";
import { CheckError } from "../../../ErrorHandling";
import { FETCH_ENROLMENT_LIMIT } from "../../../globalData";
import {
  APPROVE_ENROLMENT_MUTATION,
  REJECT_ENROLMENT_MUTATION,
} from "../../../graphql/mutation";
import { FETCH_ENROLREQUEST_QUERY } from "../../../graphql/query";
import Enrolment from "./Enrolment";
import "./EnrolRequest.css";

const { Content } = Layout;

export default () => {
  const {
    enrolCount,
    setEnrolCount,
    enrolments,
    fetchedDone,
    loadEnrolments,
    setFetchedDone
  } = useContext(EnrolmentContext);
  const [visible, SetVisible] = useState(false);
  const [selectedEnrolment, SetSelectedEnrolment] = useState({});
  const [isApprove, SetIsApprove] = useState(false);

  const { data, loading, fetchMore, networkStatus, refetch } = useQuery(
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

        loadEnrolments(
          fetchMoreResult.getPendingEnrolledCourses.pendingEnrolledCourses
        );

        return {
          getPendingEnrolledCourses: {
            __typename: "pendingEnrolledCourses",
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
    if (pressed === "approved") {
      SetIsApprove(true);
    } else if (pressed === "rejected") {
      SetIsApprove(false);
    }
  };

  const handleCancel = () => {
    SetVisible(false);
    SetSelectedEnrolment({});
  };

  const handleConfirm = () => {
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
    <div className="enrolments">
      <Layout className="enrolments layout">
        <Navbar />

        <Layout>
          <Greeting />
          <PageTitleBreadcrumb
            titleList={[{ name: "Enrol Request", link: "/enrolrequest" }]}
          />
          {loading && <Spin tip="Loading..." />}

          <Content className="enrolments__content">
            <Card>
              <div>
                {loading ? (
                  ""
                ) : enrolments.length !== 0 ? (
                  <p>Please approve or reject the following enrolments</p>
                ) : (
                  <p>No enrolments</p>
                )}
              </div>
              {enrolments.map((enrolment) => (
                <Enrolment
                  key={enrolment._id}
                  enrolment={enrolment}
                  handleApproveRejectButton={handleApproveRejectButton}
                />
              ))}
              {enrolments.length > 0 && !fetchedDone && (
                <Button onClick={handleFetchMore} loading={loading}>
                  Load More
                </Button>
              )}

              {enrolments?.length !== 0 && fetchedDone && (
                <div className="allLoadedCard">
                  <h3>All Enrolment Loaded</h3>
                </div>
              )}
            </Card>
          </Content>
          {enrolments && (
            <Modal
              className="lecturerDashboard__modal"
              title="Delete Course"
              visible={visible}
              onOk={handleConfirm}
              onCancel={handleCancel}
              okButtonProps={{
                disabled:
                  approveEnrolmentStatus.loading ||
                  rejectEnrolmentStatus.loading,
              }}
              cancelButtonProps={{
                disabled:
                  approveEnrolmentStatus.loading ||
                  rejectEnrolmentStatus.loading,
              }}
              okText={isApprove ? "Approve" : "Reject"}
            >
              {!approveEnrolmentStatus.loading &&
              !rejectEnrolmentStatus.loading ? (
                <div className="enrolment__confirm">
                  <p>
                    Are you sure to{" "}
                    {isApprove ? (
                      <span
                        style={{
                          color: "green",
                          fontWeight: 900,
                          fontSize: "20px",
                        }}
                      >
                        "approve"
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "red",
                          fontWeight: 900,
                          fontSize: "20px",
                        }}
                      >
                        "reject"
                      </span>
                    )}{" "}
                    the following enrolment?
                  </p>
                  <strong>Student: </strong>
                  {selectedEnrolment.student?.firstName}{" "}
                  {selectedEnrolment.student?.lastName} (
                  {selectedEnrolment.student?.cardID})
                  <br />
                  <br />
                  <strong>
                    Course (ID: {selectedEnrolment.course?.shortID}):{" "}
                  </strong>
                  {selectedEnrolment.course?.code}{" "}
                  {selectedEnrolment.course?.name} (
                  {selectedEnrolment.course?.session})
                </div>
              ) : (
                <Spin tip="Loading...">
                  <div className="enrolment__confirm">
                    <p>
                      Are you sure to{" "}
                      {isApprove ? (
                        <span
                          style={{
                            color: "green",
                            fontWeight: 900,
                            fontSize: "20px",
                          }}
                        >
                          "approve"
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "red",
                            fontWeight: 900,
                            fontSize: "20px",
                          }}
                        >
                          "reject"
                        </span>
                      )}{" "}
                      the following enrolment?
                    </p>
                    <strong>Student: </strong>
                    {selectedEnrolment.student?.firstName}{" "}
                    {selectedEnrolment.student?.lastName} (
                    {selectedEnrolment.student?.cardID})
                    <br />
                    <br />
                    <strong>
                      Course (ID: {selectedEnrolment.course?.shortID}):{" "}
                    </strong>
                    {selectedEnrolment.course?.code}{" "}
                    {selectedEnrolment.course?.name} (
                    {selectedEnrolment.course?.session})
                  </div>
                </Spin>
              )}
            </Modal>
          )}
          <Footer />
        </Layout>
      </Layout>
    </div>
  );
};
