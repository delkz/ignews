﻿import { render, screen, fireEvent } from '@testing-library/react'
import { SubscribeButton } from '.'
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/router'


jest.mock("next-auth/react")
jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
    }),
}))


describe('SubscribeButton Component', () => {
    it("renders correctly", () => {

        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: "unauthenticated"
        });


        render(
            <SubscribeButton />
        );
        expect(screen.getByText('Subscribe now')).toBeInTheDocument();
    })

    it("redirects user to sign in when not authenticated", () => {
        const signInMocked = jest.mocked(signIn)
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: "unauthenticated"
        });
        render(
            <SubscribeButton />
        );

        const subscribeButton = screen.getByText('Subscribe now');
        fireEvent.click(subscribeButton);

        expect(signInMocked).toHaveBeenCalled();

    })

    it("redirects user to post when user already has a subscription", () => {
        const useRouterMocked = jest.mocked(useRouter);
        const useSessionMocked = jest.mocked(useSession);

        useSessionMocked.mockReturnValueOnce({
            data: {
                user: {
                    name: 'John Doe',
                    email: 'johndoe@example.com'
                },
                activeSubscription: "fake-active-subscription",
                expires: 'fake-expires'
            },
            status: "authenticated"
        })

        const pushMock = jest.fn();


        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(
            <SubscribeButton />
        );

        const subscribeButton = screen.getByText('Subscribe now');
        fireEvent.click(subscribeButton);

        expect(pushMock).toHaveBeenCalledWith('/posts');

    })

})

