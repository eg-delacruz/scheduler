import {
  Body,
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
  appointeeEmail: string;
  appointeeNote: string;
  meetingTime: string;
  duration: number;
  date: string;
  meetingUrl: string;
  location_platform: string;
}

export const SchedulerUserConfirmationEmail = ({
  appointeeName,
  appointeeEmail,
  appointeeNote,
  meetingTime,
  duration,
  date,
  meetingUrl,
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
                  You have a new meeting with {appointeeName}
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
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Appointee email: </b>
                  {appointeeEmail}
                </Text>
                {appointeeNote && (
                  <Text style={{ ...paragraph, marginTop: -5 }}>
                    <b>Appointee note: </b>
                    {appointeeNote}
                  </Text>
                )}
                <Text
                  style={{
                    color: 'rgb(0,0,0, 0.5)',
                    fontSize: 14,
                    marginTop: -5,
                  }}
                >
                  *Sign in to{' '}
                  <a
                    href='https://scheduler-six-mu.vercel.app/'
                    target='_blank'
                  >
                    your account
                  </a>{' '}
                  to view more details
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Footer */}
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

SchedulerUserConfirmationEmail.PreviewProps = {
  appointeeName: 'Gerardo De La Cruz',
  appointeeEmail: 'netoxas317@gmial.com',
  appointeeNote: 'Please be on time',
  meetingTime: '10:00 AM',
  duration: 30,
  date: 'June 30, 2022',
  meetingUrl: 'https://meet.google.com',
  location_platform: 'Phone',
} as Props;

export default SchedulerUserConfirmationEmail;

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
