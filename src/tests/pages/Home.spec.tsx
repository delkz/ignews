﻿import { render, screen } from '@testing-library/react';
import { stripe } from '../../services/stripe';
import { mocked } from 'jest-mock'
import Home, { getStaticProps } from '../../pages';

jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
    }),
}))

jest.mock('next-auth/react', () => {
    return {
        useSession: () => [{
            data: null,
            status: "unauthenticated"
        }]
    }
});

jest.mock('../../services/stripe');

describe('Home Page', () => {
    it('Renders Correctly', () => {
        render(<Home product={{ priceId: 'fake-price-id', amount: "R$10,00" }} />)

        expect(screen.getByText('for R$10,00 month')).toBeInTheDocument()

    })


    it('loads initial data', async () => {
        const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);

        retrieveStripePricesMocked.mockResolvedValueOnce({
            id: 'fake-price-id',
            unit_amount: 1000,
        } as any);

        const response = await getStaticProps({});

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    product: {
                        priceId: 'fake-price-id',
                        amount: '$10.00'
                    }
                }
            })
        )
    })
})