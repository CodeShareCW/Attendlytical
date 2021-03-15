import { Card, Layout, Typography } from 'antd';
import React from 'react';
import { HeaderNavbar } from '../../../components/common/mainMenu';
import { Footer } from '../../../components/common/sharedLayout';
const { Content } = Layout;
const { Title } = Typography;

export default () => {
    return (
        <Layout className='home layout'>
            <HeaderNavbar />
            <Content>
                <Card>
                    <Title level={2}>Privacy Policy for Attendlytical</Title>

                    <p>At Attendlytical, accessible from https://attendlytical.netlify.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Attendlytical and how we use it.</p>

                    <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>

                    <p>This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Attendlytical. This policy is not applicable to any information collected offline or via channels other than this website. Our Privacy Policy was created with the help of the <a href="https://www.privacypolicygenerator.info/#wizard">Free Privacy Policy Generator</a>.</p>

                    <Title level={4}>Consent</Title>

                    <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>

                    <Title level={4}>Information we collect</Title>

                    <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
                    <p>If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>
                    <p>When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.</p>

                    <Title level={4}>How we use your information</Title>

                    <p>We use the information we collect in various ways, including to:</p>

                    <ul>
                        <li>Provide, operate, and maintain our webste</li>
                        <li>Improve, personalize, and expand our webste</li>
                        <li>Understand and analyze how you use our webste</li>
                        <li>Develop new products, services, features, and functionality</li>
                        <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the webste, and for marketing and promotional purposes</li>
                        <li>Send you emails</li>
                        <li>Find and prevent fraud</li>
                    </ul>

                    <Title level={4}>Facial Data Privacy Policy</Title>
                    <p>We will use your facial data to extract the features in order to perform facial analytics.</p>
                    <p>We will use Cloudinary online image storage to save facial data and retrieve the CDN url for display purpose.</p>
                    <p>We do not sell, advertise or publish your facial data to third-party.</p>
                    <p>Your facial data is protected and will not be used for any illegal misconduct.</p>
                    <p>When you upload your face photo in our website, you agree to let us to use your facial data and save into Cloudinary.</p>
                    <Title level={4}>Log Files</Title>

                    <p>Attendlytical follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>




                    <Title level={4}>Advertising Partners Privacy Policies</Title>

                    <p>You may consult this list to find the Privacy Policy for each of the advertising partners of Attendlytical.</p>

                    <p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Attendlytical, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>

                    <p>Note that Attendlytical has no access to or control over these cookies that are used by third-party advertisers.</p>

                    <Title level={4}>Third Party Privacy Policies</Title>

                    <p>Attendlytical's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options. </p>

                    <p>You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.</p>

                    <Title level={4}>CCPA Privacy Rights (Do Not Sell My Personal Information)</Title>

                    <p>Under the CCPA, among other rights, California consumers have the right to:</p>
                    <p>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</p>
                    <p>Request that a business delete any personal data about the consumer that a business has collected.</p>
                    <p>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</p>
                    <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>

                    <Title level={4}>GDPR Data Protection Rights</Title>

                    <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
                    <p>The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.</p>
                    <p>The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</p>
                    <p>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</p>
                    <p>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</p>
                    <p>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</p>
                    <p>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</p>
                    <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>

                    <Title level={4}>Children's Information</Title>

                    <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>

                    <p>Attendlytical does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>
                </Card>
            </Content>
            <Footer />
        </Layout>
    );
}
