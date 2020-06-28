import React from 'react'
import styled from 'styled-components'

import { Button } from '../core/button'

const action = 'https://api.elasticemail.com/contact/add?version=2'
const name = 'email'

const Box = styled.div`
  background-color: white;
  padding: 1rem;
`
const Title = styled.div`
  font-size: 1.2rem;
`
const Text = styled.p`
  margin: 1rem 0;
`

const Input = styled.input`
  font-size: 1rem;
  border-radius: 3px;
  padding: 0.5rem;
  border: 1px solid var(--boxBorderColor);
  width: 100%;
`

const SignUpButton = styled(Button)`
  display: block;
  width: 100%;
  margin-top: 1rem;
`

export const SubscribeForm = () => {
  return (
    <Box>
      <Title>Get the rankings in your inbox</Title>
      <Text>
        Sign up for and you'll receive exclusive stats about the most popular
        JavaScript projects every week.
      </Text>
      <Text>
        Check online the latest issue:{' '}
        <a href="https://weekly.bestofjs.org/latest">
          Weekly Best of JavaScript
        </a>
        .
      </Text>
      <form action={action} method="post">
        <Input name={name} type="email" required placeholder="Email address" />
        <SignUpButton type="submit">Sign Up</SignUpButton>
        <input
          name="publiclistid"
          id="CwyOqTgB"
          value="72c3249d-ed56-484d-b586-71c80b84d469"
          type="hidden"
        />
        <input
          name="publicaccountid"
          value="0941e3f0-7b53-413c-a17f-06bff65f0a13"
          type="hidden"
        />
        <input
          name="publicformid"
          value="e362aac5-777d-4d8b-a537-c807041f37cb"
          type="hidden"
        />
        <input
          name="returnUrl"
          value="https://weekly.bestofjs.org/check-email/"
          type="hidden"
        />
        <input
          name="activationReturnUrl"
          value="https://weekly.bestofjs.org/email-confirmed/"
          type="hidden"
        />
        <input name="alreadyactiveurl" value="" type="hidden" />
        <input
          name="activationTemplate"
          value="subscriber-activation"
          type="hidden"
        />
        <input name="source" value="WebForm" type="hidden" />
        <input id="ewf_captcha" name="captcha" value="false" type="hidden" />
        <input name="notifyEmail" value="" type="hidden" />
      </form>
    </Box>
  )
}
