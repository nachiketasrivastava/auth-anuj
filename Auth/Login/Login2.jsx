/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	Layout,
	Button,
	Row,
	Col,
	Typography,
	Form,
	Input,
	Space,
	Divider,
	Checkbox,
	Card,
	Flex,
} from 'antd';
import loginPageImage from '../../../assets/images/loginpageImage.png';
import gtmcopilotLogo from '../../../assets/images/gtmCopilotname.svg';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import crypto from 'crypto-js';
import './Login.css';
import { LoginUser } from '../../../services/AuthServices';
import Toaster from '../../../components/Toaster/Toaster';
import GoogleAuth from '../../../components/GoogleAuth/GoogleAuth';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const LogIn = ({ setIsLoggedIn, onLogin }) => {
	// const history = useHistory();
	const navigate = useNavigate();
	const commonMail = [
		'gmail.com',
		'hotmail.com',
		'outlook.com',
		'yahoo.com',
		'icloud.com',
		'protonmail.com',
	];
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);

	useEffect(() => {
		const token = localStorage.getItem('loginToken');
		let decodedToken;
		token
			? (decodedToken = jwtDecode(
					token.replace(import.meta.env.REACT_APP_TOKEN_PASSCODE, '')
			  ))
			: (decodedToken = null);
		if (decodedToken?.id) {
			onLogin();
		}
	}, []);

	const { Title, Text } = Typography;
	const { Header, Footer, Content } = Layout;

	const [CheckBox, setCheckBox] = useState(false);

	const [ShowToaster, setShowToaster] = useState(false);
	const [ShowToasterContent, setShowToasterContent] = useState({});

	const handleCheckBox = e => {
		setCheckBox(e.target.checked);
	};

	const validate = values => {
		let isValid = true;

		if (commonMail.includes(values.email.split('@')[1])) {
			isValid = false;
			setShowToaster(true);
			setShowToasterContent({
				type: 'error',
				content: 'User with Business Email are allowed to login',
			});
		}

		return isValid;
	};

	const onFinish = async values => {
		let isValid = validate(values);
		if (isValid) {
			let Login = await LoginUser({
				email: values.email,
				password: crypto.MD5(values.password).toString(),
				rememberMe: CheckBox,
			});

			if (Login.data) {
				setShowToaster(true);
				setShowToasterContent({
					type: Login.data.status,
					content: Login.data.message,
				});
			}

			if (Login.data.status === 'success') {
				setTimeout(() => {
					localStorage.setItem(
						'loginToken',
						JSON.stringify(
							Login?.data?.token + import.meta.env.REACT_APP_TOKEN_PASSCODE
						)
					);
					onLogin();
					setIsLoggedIn(true);
				}, 2000);
			}
		}
	};

	return (
		<>
			{ShowToaster && <Toaster props={ShowToasterContent} />}

			<Layout className="h-[100dvh] ">
				<Layout.Header className="xl:px-12 lg:px-0 xl:gap-y-6 lg:gap-y-6 md:gap-y-6 sm:gap-y-6 shadow bg-white">
					<Row>
						<Col span={12} className="self-center">
							<img src={gtmcopilotLogo} alt="iCustomer" />
						</Col>
						<Col span={12}>
							<div className={'flex justify-end'}>
								<p>
									{/* <span>New to iCustomer?</span> */}
									<Link to="/sign-up" className={'ml-2.5 text-[#2966BC]'}>
										{/* Sign Up */}
									</Link>
								</p>
							</div>
						</Col>
					</Row>
				</Layout.Header>
				<Content
					className={
						'xl:px-12 lg:px-0 py-0 xl:gap-y-6 lg:gap-y-6 md:gap-y-6 sm:gap-y-6 flex justify-center items-center mt-16'
					}
				>
					<Card
						className="w-[52rem] p-8 card text-center
								translate-y-[-10%]"
						styles={{ body: { padding: 0 } }}
					>
						<Row className="flex justify-between">
							<Col span={10} className="text-balance text-left">
								<Title level={1}>Log into iCustomer</Title>
							</Col>
							<Col span={14} className="gutter-row">
								<Form onFinish={onFinish}>
									<Form.Item
										label="Email"
										name="email"
										layout="vertical"
										rules={[
											{
												required: true,
												message: 'Please enter your email',
											},
										]}
									>
										<Input
											placeholder="info@yourmail.com"
											type={'email'}
											prefix={<MailOutlined style={{ marginRight: '1ch' }} />}
										/>
									</Form.Item>

									<Form.Item
										label="Password"
										name="password"
										layout="vertical"
										rules={[
											{
												required: true,
												message: 'Please enter password',
											},
										]}
										className="mt-14"
									>
										<Input
											placeholder="Enter your password"
											type={'password'}
											prefix={<LockOutlined style={{ marginRight: '1ch' }} />}
										/>
									</Form.Item>
									<Flex justify="space-between" className=" mt-14">
										<Form.Item name="rememberMe" className={'text-start'}>
											<Checkbox checked={CheckBox} onChange={handleCheckBox}>
												Keep me signed in
											</Checkbox>
										</Form.Item>
										<Link to={'/forgot-password'} className="text-[#2966BC]">
											Forgot Password?
										</Link>
									</Flex>
									<Form.Item className="w-[100%]">
										<Button
											type="primary"
											htmlType={'submit'}
											className={'w-full'}
											// style={{ borderRadius: '60px', width: '100%' }}
										>
											Login
										</Button>
									</Form.Item>
								</Form>
								<Divider plain className={'divider font-semibold pb-7'}>
									OR
								</Divider>
								<GoogleAuth setIsLoggedIn={setIsLoggedIn} onLogin={onLogin} />
							</Col>
						</Row>
					</Card>
				</Content>
			</Layout>
		</>
	);
};

export default LogIn;
