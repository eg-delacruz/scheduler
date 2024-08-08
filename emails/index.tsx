import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface Props {
  appointeeName: string;
  duration: number;
  meetingTime: string;
  date: string;
  meetingUrl: string;
  organizationName: string;
  location_platform: string;
}

export const Email = ({
  appointeeName,
  duration,
  meetingTime,
  date,
  meetingUrl,
  organizationName,
  location_platform,
}: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Yelp recent login</Preview>
      <Body style={main}>
        <Container>
          <Section style={content}>
            <Row>
              <Img
                style={image}
                width={620}
                src={'https://i.imgur.com/t7iGbis.jpeg'}
              />
            </Row>

            <Row style={{ ...boxInfos, paddingBottom: '0' }}>
              <Column>
                <Heading
                  style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  Hi {appointeeName},
                </Heading>
                <Heading
                  as='h2'
                  style={{
                    fontSize: 26,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  Thank you for scheduling a meeting with {organizationName},
                </Heading>

                <Text>Please find the meeting details:</Text>
                <Text style={paragraph}>
                  <b>Time: </b>
                  {meetingTime}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>date: </b>
                  {date}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>
                    {location_platform === 'Phone' ? 'Phone:' : 'Location:'}{' '}
                  </b>
                  {meetingUrl}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>duration: </b>
                  {duration} minutes
                </Text>
                <Text
                  style={{
                    color: 'rgb(0,0,0, 0.5)',
                    fontSize: 14,
                    marginTop: -5,
                  }}
                >
                  {location_platform === 'Phone'
                    ? '* Please join the meeting by calling the phone  number above'
                    : '*Please Join the meeting by clicking the button below or by using the link above'}
                </Text>
              </Column>
            </Row>
            <Row style={{ ...boxInfos, paddingTop: '0' }}>
              <Column style={containerButton} colSpan={2}>
                {location_platform !== 'Phone' && (
                  <Button href={meetingUrl} style={button}>
                    Join Now
                  </Button>
                )}
              </Column>
            </Row>
          </Section>

          <Section style={containerImageFooter}>
            <Img
              style={image}
              width={620}
              src={'https://i.imgur.com/NVn2duH.jpeg'}
            />
          </Section>

          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: 'rgb(0,0,0, 0.7)',
            }}
          >
            © {new Date().getFullYear()} | Scheduler is a free app designed and
            developed by{' '}
            <a href='https://www.gerardodelacruz.com/en' target='_blank'>
              Gerardo De La Cruz
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

Email.PreviewProps = {
  appointeeName: 'Alan',
  organizationName: 'El Portal',
  date: 'Today',
  duration: 30,
  meetingTime: '8 pm',
  meetingUrl: '6545313',
  location_platform: 'Phone',
} as Props;

export default Email;

const main = {
  backgroundColor: '#fff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
  fontSize: 16,
};

const containerButton = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
};

const button = {
  backgroundColor: '#266DE1',
  borderRadius: 3,
  color: '#FFF',
  fontWeight: 'bold',
  border: '1px solid rgb(0,0,0, 0.1)',
  cursor: 'pointer',
  padding: '12px 30px',
};

const content = {
  border: '1px solid rgb(0,0,0, 0.1)',
  borderRadius: '3px',
  overflow: 'hidden',
};

const image = {
  maxWidth: '100%',
};

const boxInfos = {
  padding: '20px',
};

const containerImageFooter = {
  padding: '45px 0 0 0',
};
