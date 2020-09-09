import { useMutation, useQuery } from "@apollo/react-hooks";
import { Button, Card, Layout, message, Modal, Spin } from "antd";
import React, { useContext, useState } from "react";
import { Footer, Greeting, Navbar, PageTitleBreadcrumb } from "../../../components/common/sharedLayout";
import { EnrolmentContext } from "../../../context";
import { CheckError } from "../../../ErrorHandling";
import { FETCH_ENROLMENT_LIMIT } from "../../../globalData";
import {
  APPROVE_ENROLMENT_MUTATION,
  REJECT_ENROLMENT_MUTATION
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
    setFetchedDone,
    approveEnrolment,
    rejectEnrolment,
  } = useContext(EnrolmentContext);
  const [visible, SetVisible] = useState(false);
  const [selectedEnrolment, SetSelectedEnrolment] = useState({});
  const [isApprove, SetIsApprove] = useState(false);
  const [fetchedLimit] = useState(FETCH_ENROLMENT_LIMIT);

  const { loading, fetchMore, networkStatus, refetch } = useQuery(
    FETCH_ENROLREQUEST_QUERY,
    {
      onCompleted: (data) => {
        console.log(data);
        if (enrolments.length === 0)
          loadEnrolments(data.getPendingEnrolledCourse);
        if (data.getPendingEnrolledCourse.length < fetchedLimit) {
          setFetchedDone(true);
        }
      },
      onError(err) {
        CheckError(err);
      },
      variables: {
        limit: fetchedLimit,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const [approveEnrolmentCallback, approveEnrolmentStatus] = useMutation(
    APPROVE_ENROLMENT_MUTATION,
    {
      onCompleted: (data) => {
        message.success(data.approveEnrolment);
        setEnrolCount(enrolCount-1);
        refetch();
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
        setEnrolCount(enrolCount-1);
        refetch();
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
        limit: fetchedLimit,
        cursor: enrolments[enrolments.length - 1]._id,
      },
      onError(err) {
        CheckError(err);
      },
      updateQuery: (pv, { fetchMoreResult }) => {
        if (fetchMoreResult.getPendingEnrolledCourse.length === 0) {
          setFetchedDone(true);
          return pv;
        }
        if (fetchMoreResult.getPendingEnrolledCourse.length < fetchedLimit) {
          setFetchedDone(true);
        }

        loadEnrolments(fetchMoreResult.getPendingEnrolledCourse);

        return {
          getPendingEnrolledCourse: [
            ...pv.getPendingEnrolledCourse,
            ...fetchMoreResult.getPendingEnrolledCourse,
          ],
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
          approveEnrolment(selectedEnrolment);
          SetVisible(false);
          SetSelectedEnrolment({});
        },
        variables: { id: selectedEnrolment._id },
      });
    } else {
      rejectEnrolmentCallback({
        update() {
          rejectEnrolment(selectedEnrolment);
          SetVisible(false);
          SetSelectedEnrolment({});
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
                {loading? "": enrolments.length !== 0 ? (
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
              {enrolments &&
                !fetchedDone &&
                enrolments[enrolments.length - 1]?.hasNextPage && (
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
