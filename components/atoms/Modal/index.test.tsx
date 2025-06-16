import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { test, expect, afterEach, vi } from 'vitest';
import { Modal } from './';
import { useState } from 'react';

afterEach(() => {
  cleanup();
  document.body.style.overflow = 'unset';
});

test('renders modal when isOpen is true', () => {
  const onClose = vi.fn();
  render(
    <Modal isOpen={true} onClose={onClose} title="Test Modal">
      <div>Modal content</div>
    </Modal>
  );

  expect(screen.getByText('Test Modal')).toBeInTheDocument();
  expect(screen.getByText('Modal content')).toBeInTheDocument();
});

test('does not render modal when isOpen is false', () => {
  const onClose = vi.fn();
  render(
    <Modal isOpen={false} onClose={onClose} title="Test Modal">
      <div>Modal content</div>
    </Modal>
  );

  expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
});

test('calls onClose when close button is clicked', () => {
  const onClose = vi.fn();
  render(
    <Modal isOpen={true} onClose={onClose} title="Test Modal">
      <div>Modal content</div>
    </Modal>
  );

  const closeButton = screen.getByLabelText('Close modal');
  fireEvent.click(closeButton);

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('calls onClose when backdrop is clicked', () => {
  const onClose = vi.fn();
  render(
    <Modal isOpen={true} onClose={onClose} title="Test Modal">
      <div>Modal content</div>
    </Modal>
  );

  const backdrop = document.querySelector('.bg-black.bg-opacity-50');
  fireEvent.click(backdrop!);

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('calls onClose when Escape key is pressed', () => {
  const onClose = vi.fn();
  render(
    <Modal isOpen={true} onClose={onClose} title="Test Modal">
      <div>Modal content</div>
    </Modal>
  );

  fireEvent.keyDown(document, { key: 'Escape' });

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('sets body overflow to hidden when modal is open', () => {
  const onClose = vi.fn();
  const { unmount } = render(
    <Modal isOpen={true} onClose={onClose} title="Test Modal">
      <div>Modal content</div>
    </Modal>
  );

  expect(document.body.style.overflow).toBe('hidden');

  unmount();
  expect(document.body.style.overflow).toBe('unset');
});


test('should open and close modal using button with useState', () => {
  const TestComponent = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <button
          data-testid="open-modal-btn"
          onClick={() => setIsOpen(true)}
        >
          Open Modal
        </button>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Test Modal"
        >
          <div data-testid="modal-content">
            This is the modal content
          </div>
        </Modal>
      </div>
    );
  };

  render(<TestComponent />);

  // Initially modal should be closed
  expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();

  // Click button to open modal
  const openButton = screen.getByTestId('open-modal-btn');
  fireEvent.click(openButton);

  // Modal should be open and content visible
  expect(screen.getByText('Test Modal')).toBeInTheDocument();
  expect(screen.getByTestId('modal-content')).toBeInTheDocument();
  expect(screen.getByText('This is the modal content')).toBeInTheDocument();

  // Close modal by clicking X button
  const closeButton = screen.getByLabelText('Close modal');
  fireEvent.click(closeButton);

  // Modal should be closed
  expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
});
