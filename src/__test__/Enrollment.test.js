import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Enrollment from '../components/Enrollment';

beforeEach(() => {
    global.fetch = jest.fn((url) =>
        Promise.resolve({
            json: () => {
                if (url.includes('students')) {
                    return Promise.resolve([
                        { id: 1, name: "John Doe" }
                    ]);
                } else if (url.includes('courses')) {
                    return Promise.resolve([
                        { id: 1, title: "Intro to React", description: "Learn the basics of React." }
                    ]);
                } else if (url.includes('enrollments')) {
                    return Promise.resolve([
                        { id: 1, studentId: 1, courseId: 1, progress: 50 }
                    ]);
                }
                return Promise.resolve([]);
            },
        })
    );
});

afterEach(() => {
    global.fetch.mockClear();
});

describe('boundary', () => {
    test('EnrollmentComponent boundary renders without crashing', () => {
        render(<Enrollment />);
    });

    test('EnrollmentComponent boundary displays heading', async () => {
        render(<Enrollment />);
        expect(await screen.findByText('Enroll Student in Course')).toBeInTheDocument();
    });

    test('EnrollmentComponent boundary form is rendered and can submit an enrollment', async () => {
        render(<Enrollment />);
        await waitFor(() => expect(screen.getByLabelText('Select Student:')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByLabelText('Select Course:')).toBeInTheDocument());
        fireEvent.change(screen.getByLabelText('Select Student:'), { target: { value: 1 } });
        fireEvent.change(screen.getByLabelText('Select Course:'), { target: { value: 1 } });
        fireEvent.click(screen.getByRole('button', { name: 'Enroll' }));
        expect(global.fetch).toHaveBeenCalledTimes(4);
    });

    test('EnrollmentComponent boundary Displays enrollments and allows progress update', async () => {
        render(<Enrollment />);
        await waitFor(() => expect(screen.getByText(/John Doe - Intro to React - Progress: 50%/)).toBeInTheDocument());
        const progressInput = screen.getByDisplayValue('50');
        fireEvent.change(progressInput, { target: { value: '75' } });
        fireEvent.click(screen.getByText('Update Progress'));
        expect(global.fetch).toHaveBeenCalled();
    });
});
