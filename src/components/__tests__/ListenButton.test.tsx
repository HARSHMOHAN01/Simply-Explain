/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ListenButton from '../ListenButton';

describe('ListenButton', () => {
  beforeEach(() => {
    // Mock window.speechSynthesis
    const mockSpeechSynthesis = {
      cancel: vi.fn(),
      speak: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
    };
    
    // @ts-ignore
    window.speechSynthesis = mockSpeechSynthesis;
    
    // @ts-ignore
    window.SpeechSynthesisUtterance = class {
      text: string;
      lang: string = '';
      rate: number = 1;
      onend: any = null;
      onerror: any = null;
      constructor(text: string) {
        this.text = text;
      }
    };
  });

  it('renders the Listen button', () => {
    render(<ListenButton textToRead="Hello world" language="English" />);
    expect(screen.getByText(/Listen/i)).toBeTruthy();
  });

  it('calls speechSynthesis.speak when clicked', () => {
    render(<ListenButton textToRead="Test speech" language="English" />);
    const btn = screen.getByRole('button', { name: /Listen/i });
    
    fireEvent.click(btn);
    
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
    expect(screen.getByText(/Pause Reading/i)).toBeTruthy();
  });

  it('shows Stop button when reading', () => {
    render(<ListenButton textToRead="Test speech" language="English" />);
    
    fireEvent.click(screen.getByRole('button', { name: /Listen/i }));
    
    const stopBtn = screen.getByRole('button', { name: /Stop/i });
    expect(stopBtn).toBeTruthy();
    
    fireEvent.click(stopBtn);
    expect(window.speechSynthesis.cancel).toHaveBeenCalledTimes(2); // once on start, once on stop
  });
});
