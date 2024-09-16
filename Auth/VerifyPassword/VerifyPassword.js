import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Layout, Button, Row, Col, Typography, Space, Divider } from "antd";
import loginPageImage from "../../../assets/images/loginpageImage.png";
import gtmcopilotLogo from "../../../assets/images/gtmCopilotname.svg";
import "./VerifyPassword.css";
import Toaster from "../../../components/Toaster/Toaster";
import ShowModal from "../../../components/Modal/Modal";
import { VerfiyUser } from "../../../services/AuthServices";


const VerifyPassword = () => {
  const url_params = useParams();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const nextUrl = queryParams.get("to");

  const { Title } = Typography;
  const { Header, Footer, Content } = Layout;

  const [ShowToaster, setShowToaster] = useState(false);
  const [ShowToasterContent, setShowToasterContent] = useState({});

  const [Modal, setModal] = useState(false);
  const [ModalContent, setModalContent] = useState({});

  const verifyusers = async (e) => {
    e.preventDefault();
    const data = {
      verification_code: url_params.verification_token,
      user_id: url_params.user_id,
      app: process.env.REACT_APP_LOGIN_PAGE
    }

    let response = await VerfiyUser(data);

    if (response.data.status === 'success') {
      setModalContent({
        content: 'Your account has been verified successfully. Please login to continue.',
        title: 'Account Verified Successfully',
        closeAction: "/login",
        okAction: "/login",
        btnText: 'Return to Login page'
      })
      setModal(true)
    }

    if (response.data.status === 'error') {
      setShowToaster(true);
      setShowToasterContent({
        type: response.data.status,
        content: response.data.message
      })
    }
  }

  return (
    <>
      {Modal ?
        <>
          <ShowModal props={ModalContent} />
        </> :
        <>
          {ShowToaster && <Toaster props={ShowToasterContent} />}
          <Row className={'h-screen bg-white 2xl:overflow-hidden'}>
            <Col span={12} xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} >
              <Space direction="vertical" className={'w-full mt-5'}>
                <Layout className={'bg-white xl:px-12 lg:px-0 py-0 xl:gap-y-32 lg:gap-y-20 md:gap-y-20 sm:gap-y-20'} style={{ backgroundColor: '#fff' }}>
                  <Header className={'bg-white'}>
                    <Row>
                      <Col span={12}>
                        <img
                          style={{ height: "50px" }}
                          src={gtmcopilotLogo}
                          alt=""
                        />
                      </Col>
                      <Col span={12}>

                      </Col>
                    </Row>
                  </Header>
                  <Content className={'py-0 px-12'}>
                    <Row className={'flex-col'}>
                      <Col span={24} className="gutter-row">
                        <Title className={'verificationText'}>Please Verify your Account</Title>
                      </Col>
                      <Button type="primary" onClick={(e) => { verifyusers(e) }} className={'w-full'}>Verify</Button>
                    </Row>
                  </Content>
                  <Footer className={'bg-[transparent]'}>
                    <Row>
                      <Col span={24} className={'text-center pb-2'}>
                        <p>© All Rights Reserved to iCustomer</p>
                      </Col>
                    </Row>
                  </Footer>
                </Layout>
              </Space>
            </Col>
            <Col span={12} xs={0} sm={12} md={12} lg={12} xl={12} xxl={12} >
              <img src={loginPageImage} alt="" className={'w-full h-full'} />
            </Col>
          </Row>
        </>
      }
    </>
  );
}

export default VerifyPassword;