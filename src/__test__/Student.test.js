import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Student from '../components/Student';

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([
                { id: 1, name: "Jane Doe" }
            ])
        })
    );
});

afterEach(() => {
    global.fetch.mockClear();
});

describe('boundary', () => {
    test('StudentComponent boundary renders without crashing', () => {
        render(<Student />);
    });

    test('StudentComponent boundary displays "Students" heading', async () => {
        render(<Student />);
        expect(await screen.findByText('Students')).toBeInTheDocument();
    });

    test('StudentComponent boundary displays student list after fetching data', async () => {
        render(<Student />);
        const listItem = await waitFor(() => screen.getByText("Jane Doe"));
        expect(listItem).toBeInTheDocument();
    });

    test('StudentComponent boundary Add a New Student form is rendered', () => {
        render(<Student />);
        expect(screen.getByLabelText('Name:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add Student' })).toBeInTheDocument();
    });

    test('StudentComponent boundary Submitting form adds a new student', async () => {
        const newStudentName = "John Smith";
        fetch.mockImplementationOnce(() => Promise.resolve({
            json: () => Promise.resolve([
                { id: 1, name: "Jane Doe" },
            ])
        }))
            .mockImplementationOnce(() => Promise.resolve({
                json: () => Promise.resolve({ id: 2, name: newStudentName })
            }));

        render(<Student />);
        await waitFor(() => expect(screen.getByText("Jane Doe")).toBeInTheDocument());
        fireEvent.change(screen.getByLabelText('Name:'), { target: { value: newStudentName } });
        fireEvent.click(screen.getByRole('button', { name: 'Add Student' }));
        await waitFor(() => expect(screen.getByText(newStudentName)).toBeInTheDocument());
        expect(global.fetch).toHaveBeenCalledTimes(3);
    });
});
