import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Courses from '../components/Courses';

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([{ id: 1, title: "Intro to React", description: "Learn the basics of React." }])
        })
    );
});

afterEach(() => {
    global.fetch.mockClear();
});

describe('boundary', () => {
    test('CoursesComponent boundary renders without crashing', () => {
        render(<Courses />);
    });

    test('CoursesComponent boundary displays "Courses" heading', () => {
        render(<Courses />);
        expect(screen.getByText('Courses')).toBeInTheDocument();
    });

    test('CoursesComponent boundary displays course list after fetching data', async () => {
        render(<Courses />);
        const listItem = await waitFor(() => screen.getByText(/Intro to React - Learn the basics of React./));
        expect(listItem).toBeInTheDocument();
    });

    test('CoursesComponent boundary Add a New Course form is rendered', () => {
        render(<Courses />);
        expect(screen.getByLabelText('Title:')).toBeInTheDocument();
        expect(screen.getByLabelText('Description:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add Course' })).toBeInTheDocument();
    });

    test('CoursesComponent boundary Submitting form adds a new course', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve([{ id: 1, title: "Intro to React", description: "Learn the basics of React." }]), // Initial load
            })
        )
            .mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve({ id: 2, title: "Advanced React", description: "Learn advanced concepts in React." }), // Adding new course
                })
            );
        render(<Courses />);
        await waitFor(() => expect(screen.getByText(/Intro to React - Learn the basics of React./)).toBeInTheDocument());
        fireEvent.change(screen.getByLabelText('Title:'), { target: { value: 'Advanced React' } });
        fireEvent.change(screen.getByLabelText('Description:'), { target: { value: 'Learn advanced concepts in React.' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add Course' }));
        await waitFor(() => expect(screen.getByText(/Advanced React - Learn advanced concepts in React./)).toBeInTheDocument());
    });
});
