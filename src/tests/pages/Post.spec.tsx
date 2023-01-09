import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock'
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getSession } from "next-auth/react";
import { getPrismicClient } from '../../services/prismic';

const post = {
    slug: 'my-new-post',
    title: 'My new post',
    content: '<p>Post excerpt</p>',
    updatedAt: '10 de abril'
}

jest.mock('next-auth/react');


jest.mock('../../services/prismic')

describe('Posts Page', () => {
    it('Renders Correctly', () => {
        render(<Post post={post} />)

        expect(screen.getByText('My new post')).toBeInTheDocument()
        expect(screen.getByText('Post excerpt')).toBeInTheDocument()
    })


    it('redirect user if no subscription is found', async () => {
        const getSessionMocked = mocked(getSession);
        getSessionMocked.mockResolvedValueOnce(null)

        const response = await getServerSideProps({
            params: { slug: 'my-new-post' }
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/posts/preview/my-new-post',
                })
            })
        )
    })

    it('loads initial data', async () => {
        const getSessionMocked = mocked(getSession);
        const getPrismicClientMocked = mocked(getPrismicClient);
        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: 'heading', text: 'My new post' }
                    ],
                    content: [
                        { type: 'paragraph', text: 'Post excerpt' }
                    ],

                },
                last_publication_date: '04-01-2023'
            })
        } as any)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any)


        const response = await getServerSideProps({
            params: { slug: 'my-new-post' }
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'My new post',
                        content: '<p>Post excerpt</p>',
                        updatedAt: "01 de abril de 2023",
                    }
                }
            })
        )
    })
})