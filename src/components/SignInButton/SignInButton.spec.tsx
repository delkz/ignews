import { render, screen } from '@testing-library/react'
import { SignInButton } from '.'
import { useSession } from 'next-auth/react'
import { mocked } from 'jest-mock'

jest.mock("next-auth/react");

describe('SignInButton Component', () => {
    it("renders correctly when user is not authenticated", () => {
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: "unauthenticated"
        });

        render(
            <SignInButton />
        );

        expect(screen.getByText('Sign in with github')).toBeInTheDocument();
    })


    it("renders correctly when user is authenticated", () => {
        const useSessionMocked = jest.mocked(useSession)

        useSessionMocked.mockReturnValueOnce({
          data: {
            user: {
              name: 'John Doe',
              email: 'johndoe@example.com'
            },
            expires: 'fake-expires'
          },
          status: "authenticated"
        })

        
        render(
            <SignInButton />
        );

        expect(screen.getByText('John Doe')).toBeInTheDocument();
    })

})

