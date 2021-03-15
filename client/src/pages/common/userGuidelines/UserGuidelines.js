import { Button, Card, Col, Layout, Row, Avatar, Divider, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderNavbar } from '../../../components/common/mainMenu';
import { Footer } from '../../../components/common/sharedLayout';
import 'rc-texty/assets/index.css';
const { Content } = Layout;
const { Title } = Typography;
export default () => {
    return (
        <Layout className='home layout'>
            <HeaderNavbar />
            <Content>
                <Card>
                    <Row>
                    <Title level={2}>User Guidelines</Title>
                    </Row>
                    <Row>
                        There are 2 user roles which are "Student" and "Lecturer"
                    </Row>

                </Card>
                <Divider />
                <Card>
                    <Row>
                        Instructions For Lecturer:
                    </Row>
                    <Row>
                        1. Register an account.
                    </Row>
                    <Row>
                        2. Create a course.
          </Row>
                    <Row>
                        3. Give the course unique ID to your students.
          </Row>
                    <Row>
                        4. Students need to send the request to enrol, approve the enrolment.
          </Row>
                    <Row>
                        5. You do not need upload student's face photo, which will be done by students.
          </Row>
                    <Row>
                        6. After all student enrolled, select a course and take the attendance.
          </Row>
                    <Row>
                        7. You can see how many face photo of all the enrolled students have uploaded.
          </Row>
                    <Row>
                        8. Ensure that the students upload their face photo, otherwise there is no facial data of that student for reference.
          </Row>
                    <Row>
                        9. Only those enrol in the particular course will be counted into dataset for facial classification.
          </Row>
                    <Row>
                        10. Inside attendance taking form, select the time, date and camera.
          </Row>
                    <Row>
                        11. Wait for all the models being loaded.
          </Row>
                    <Row>
                        12. Set the approriate threshold distance as you wish.
          </Row>
                    <Row>
                        13. Submit the attendance form if finished.
          </Row>
                    <Row>
                        14. Visualize the attendance data in "Attendance History", or you can enter a particular course and click "View Attendance History".
          </Row>
                    <Row>
                        15. You can "Warn" or "Kick" the student out of a course.
          </Row>
                    <Row>
                        16. The face photo of the student who is kicked out will not be counted next time taking the attendance.
          </Row>
                </Card>
                <Divider />
                <Card>
                    <Row>
                        Instructions For Student:
          </Row>
                    <Row>
                        1. Register an account.
          </Row>
                    <Row>
                        2. Enrol a course.
          </Row>
                    <Row>
                        3. Wait for approval from the lecturer.
          </Row>
                    <Row>
                        4. Upload your face photo in "Face Gallery", best to have at least 2 face photo.
          </Row>
                    <Row>
                        5. Wait for all models being loaded.
          </Row>
                    <Row>
                        6. The system will perform face detection, ensuring only a single face exist and rejecting photo with empty face or multiple faces.
          </Row>
                    <Row>
                        7. The photo will be uploaded to the image storage.
          </Row>
                    <Row>
                        8. When your lecturer take the attendance of a particular course, all your uploaded facial data will be counted into the dataset for facial comparison.
          </Row>
                    <Row>
                        9. Visualize the attendance data in "Attendance History", or you can enter a particular course and click "View Attendance History".
          </Row>

                </Card>
                <Divider />
                <Card>
                    <Row style={{ display: 'flex', justifyContent: 'flex-end'}}>
                        The website use API provided by: <a href="https://github.com/justadudewhohacks/face-api.js" target="_blank">face-api.js</a>
                    </Row>
                    <Row style={{ display: 'flex', justifyContent: 'flex-end'}}>
                        Credit to author: <a href="https://github.com/justadudewhohacks" target="_blank">justadudewhohacks</a>
                    </Row>
                </Card>
            </Content>
            <Footer />
        </Layout>
    )
}
