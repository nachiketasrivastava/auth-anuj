import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Layout, Button, Row, Col, Typography, Form, Input, Space, Divider } from "antd";
import loginPageImage from "../../../assets/images/loginpageImage.png";
import gtmcopilotLogo from "../../../assets/images/gtmcopilot_logo_s.png";
import { LockOutlined } from "@ant-design/icons";
import crypto from "crypto-js";
import "./ResetPassword.css";
import Toaster from "../../../components/Toaster/Toaster";
import { UserDetails } from "../../../helpers/helpers";
import ShowModal from "../../../components/Modal/Modal";
import { PasswordReset } from "../../../services/AuthServices";


const ResetPassword = () => {

  const url_params = useParams();

  const userDetails = UserDetails();
  const isLoggedIn = userDetails?.id ? true : false;

  if (isLoggedIn) {
    // history.push('/explore-audience');
  };

  const { Title } = Typography;
  const { Header, Footer, Content } = Layout;

  const [ShowToaster, setShowToaster] = useState(false);
  const [ShowToasterContent, setShowToasterContent] = useState({});

  const [Modal, setModal] = useState(false);
  const [ModalContent, setModalContent] = useState({});

  const validate = (values) =>{

    let isValid = true;

    if(values.password && values.password.length < 8){
      isValid = false;
      setShowToaster(true);
      setShowToasterContent({
        type: 'error',
        content: 'Password must be more than 8 characters'
      })
    }

    if(values.confirmPassword && values.confirmPassword.length < 8){
      isValid = false;
      setShowToaster(true);
      setShowToasterContent({
        type: 'error',
        content: 'Confirm password must be more than 8 characters'
      })
    }

    if(values.password !== values.confirmPassword){
      isValid = false;
      setShowToaster(true);
      setShowToasterContent({
        type: 'error',
        content: 'Password & confirm password must be same'
      })
    }

    return isValid;
  }

  const onFinish= async (values) => {
    let isValid = validate(values);
    if(isValid){

      const data = {
        reset_code: url_params.reset_code,
        user_id: url_params.user_id,
        password: crypto.MD5(values.password).toString()
      };

      let response = await PasswordReset(data);

      if(response.data.status === 'success'){
        setModalContent({
          content: 'Your password has been reset successfully. Please login to continue.',
          title: 'Loggged In Successfully',
          closeAction: '/login',
          okAction: '/login',
          btnText: 'Return to Login page'
        })
        setModal(true)
      }
      if(response.data.code === 'old password'){
        setShowToaster(true);
        setShowToasterContent({
          type: response.data.status,
          content: response.data.message
        })
      } else if(response.data.code !== 'old password' && response.data.status === 'error'){
        setShowToaster(true);
        setShowToasterContent({
          type: response.data.status,
          content: response.data.message
        })
      }
    }
  }

  return (
    <>
      {Modal ?
        <>
          <ShowModal props={ModalContent} />
        </> :
        <>
          {ShowToaster && <Toaster props={ShowToasterContent}  />}
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
                        <Title className={'text-start'}>Reset Password</Title>
                      </Col>
                      <Divider plain className={''}></Divider>
                        <Form layout="vertical" onFinish={onFinish}>
                        <Col span={24} className="gutter-row">
                          <Form.Item
                            label="New Password"
                            name="password"
                            rules={[
                              {
                                required: true,
                                message: 'Please enter password'
                              }
                            ]}
                          >
                            <Input placeholder="Enter new password" type={"password"} prefix={<LockOutlined />} />
                          </Form.Item>
                        </Col>
                        <Col span={24} className="gutter-row">
                          <Form.Item
                            label="Confirm Password"
                            name="confirmPassword"
                            rules={[
                              {
                                required: true,
                                message: 'Please enter password'
                              }
                            ]}
                          >
                            <Input placeholder="Confirm your Password" type={"password"} prefix={<LockOutlined />} />
                          </Form.Item>
                        </Col>
                        <Col span={24} className="gutter-row">
                          <Form.Item>
                            <Button type="primary" htmlType={"submit"} className={'w-full'}>Reset Password</Button>
                          </Form.Item>
                        </Col>
                        </Form>
                    </Row>
                  </Content>
                  <Footer className={'bg-[transparent]'}>
                    <Row>
                      <Col span={24} className={'text-center pb-2'}>
                        <p>© All Rights Reserved to GTM COPILOT</p>
                      </Col>
                    </Row>
                  </Footer>
                </Layout>
              </Space>
            </Col>
            <Col span={12} xs={0} sm={12} md={12} lg={12} xl={12} xxl={12} >
              <img src={loginPageImage} alt="" className={'w-full h-full'}/>
            </Col>
          </Row>
        </>
      }
    </>
  );
}

export default ResetPassword;