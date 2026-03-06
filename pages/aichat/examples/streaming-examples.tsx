/**
 * SSE Streaming Examples
 * 
 * This file contains various examples of how to use the streaming functionality
 * in different scenarios.
 */

import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { sendMessageWithStreaming } from '../store/slices/chat.thunk';
import { useChatStream } from '../hooks/useChatStream';
import { startChatStream } from '../services/streaming.service';

// ============================================================================
// Example 1: Basic Streaming with Redux (Recommended)
// ============================================================================

export function Example1_BasicReduxStreaming() {
  const dispatch = useAppDispatch();
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState('');

  const handleAsk = () => {
    dispatch(sendMessageWithStreaming({
      text: question,
      modelId: 'gpt-4',
      onStatus: (msg) => setStatus(msg),
    }));
    setQuestion('');
  };

  return (
    <div>
      <input 
        value={question} 
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
      />
      <button onClick={handleAsk}>Send</button>
      {status && <div className="status">{status}</div>}
    </div>
  );
}

// ============================================================================
// Example 2: Using the Hook for Custom UI
// ============================================================================

export function Example2_CustomHookStreaming() {
  const [question, setQuestion] = useState('');
  const { 
    streamingText, 
    status, 
    isStreaming, 
    bugResults,
    dbResults,
    startStream, 
    stopStream 
  } = useChatStream();

  const handleAsk = () => {
    startStream(
      {
        nlQuestion: question,
        projectId: 1,
        chatId: null,
      },
      {
        onStatus: (msg) => console.log('Status:', msg),
        onDone: (response) => {
          console.log('Complete response:', response);
        },
        onError: (error) => {
          console.error('Error:', error);
        },
      }
    );
    setQuestion('');
  };

  return (
    <div>
      <input 
        value={question} 
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
        disabled={isStreaming}
      />
      <button onClick={handleAsk} disabled={isStreaming}>
        {isStreaming ? 'Streaming...' : 'Send'}
      </button>
      {isStreaming && <button onClick={stopStream}>Stop</button>}
      
      {status && <div className="status">{status}</div>}
      
      <div className="response">
        {streamingText}
      </div>

      {bugResults && (
        <div className="bugs">
          <h3>Bugs Found:</h3>
          <pre>{JSON.stringify(bugResults, null, 2)}</pre>
        </div>
      )}

      {dbResults && (
        <div className="data">
          <h3>Database Results:</h3>
          <pre>{JSON.stringify(dbResults, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 3: Direct Service Usage (Advanced)
// ============================================================================

export function Example3_DirectServiceStreaming() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [closeStream, setCloseStream] = useState<(() => void) | null>(null);

  const handleAsk = () => {
    setResponse('');
    setStatus('');
    setIsStreaming(true);

    let accumulatedText = '';

    const close = startChatStream(
      {
        nlQuestion: question,
        projectId: 1,
        chatId: null,
      },
      {
        onStatus: (msg) => {
          setStatus(msg);
        },
        onToken: (chunk) => {
          accumulatedText += chunk;
          setResponse(accumulatedText);
        },
        onResult: (tool, data) => {
          console.log(`Tool ${tool} returned:`, data);
        },
        onDone: (fullResponse, error) => {
          setIsStreaming(false);
          setStatus('');
          if (error) {
            console.error('Error:', error);
          } else {
            console.log('Complete:', fullResponse);
          }
        },
        onError: (msg) => {
          setIsStreaming(false);
          setStatus('');
          console.error('Stream error:', msg);
        },
      }
    );

    setCloseStream(() => close);
    setQuestion('');
  };

  const handleStop = () => {
    if (closeStream) {
      closeStream();
      setIsStreaming(false);
      setStatus('');
    }
  };

  return (
    <div>
      <input 
        value={question} 
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
        disabled={isStreaming}
      />
      <button onClick={handleAsk} disabled={isStreaming}>
        Send
      </button>
      {isStreaming && <button onClick={handleStop}>Stop</button>}
      
      {status && (
        <div className="status-bar">
          <span className="spinner">⏳</span>
          {status}
        </div>
      )}
      
      <div className="response-box">
        {response || 'No response yet...'}
      </div>
    </div>
  );
}

// ============================================================================
// Example 4: Streaming with Progress Tracking
// ============================================================================

export function Example4_StreamingWithProgress() {
  const [question, setQuestion] = useState('');
  const [progress, setProgress] = useState({
    thinking: false,
    fetchingBugs: false,
    queryingDB: false,
    generating: false,
  });
  const { streamingText, startStream } = useChatStream();

  const handleAsk = () => {
    setProgress({
      thinking: false,
      fetchingBugs: false,
      queryingDB: false,
      generating: false,
    });

    startStream(
      {
        nlQuestion: question,
        projectId: 1,
        chatId: null,
      },
      {
        onStatus: (msg) => {
          // Update progress based on status message
          if (msg.includes('Thinking')) {
            setProgress(p => ({ ...p, thinking: true }));
          } else if (msg.includes('fetch_bugs')) {
            setProgress(p => ({ ...p, fetchingBugs: true }));
          } else if (msg.includes('query_database')) {
            setProgress(p => ({ ...p, queryingDB: true }));
          } else if (msg.includes('Generating')) {
            setProgress(p => ({ ...p, generating: true }));
          }
        },
        onDone: () => {
          setProgress({
            thinking: true,
            fetchingBugs: true,
            queryingDB: true,
            generating: true,
          });
        },
      }
    );
    setQuestion('');
  };

  return (
    <div>
      <input 
        value={question} 
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
      />
      <button onClick={handleAsk}>Send</button>
      
      <div className="progress-tracker">
        <div className={progress.thinking ? 'complete' : 'pending'}>
          {progress.thinking ? '✓' : '○'} Thinking
        </div>
        <div className={progress.fetchingBugs ? 'complete' : 'pending'}>
          {progress.fetchingBugs ? '✓' : '○'} Fetching Bugs
        </div>
        <div className={progress.queryingDB ? 'complete' : 'pending'}>
          {progress.queryingDB ? '✓' : '○'} Querying Database
        </div>
        <div className={progress.generating ? 'complete' : 'pending'}>
          {progress.generating ? '✓' : '○'} Generating Response
        </div>
      </div>
      
      <div className="response">{streamingText}</div>
    </div>
  );
}

// ============================================================================
// Example 5: Multiple Concurrent Streams (Advanced)
// ============================================================================

export function Example5_MultipleStreams() {
  const [streams, setStreams] = useState<{
    id: string;
    question: string;
    response: string;
    status: string;
    isActive: boolean;
  }[]>([]);

  const addStream = (question: string) => {
    const streamId = `stream-${Date.now()}`;
    
    setStreams(prev => [...prev, {
      id: streamId,
      question,
      response: '',
      status: '',
      isActive: true,
    }]);

    let accumulatedText = '';

    startChatStream(
      {
        nlQuestion: question,
        projectId: 1,
        chatId: null,
      },
      {
        onStatus: (msg) => {
          setStreams(prev => prev.map(s => 
            s.id === streamId ? { ...s, status: msg } : s
          ));
        },
        onToken: (chunk) => {
          accumulatedText += chunk;
          setStreams(prev => prev.map(s => 
            s.id === streamId ? { ...s, response: accumulatedText } : s
          ));
        },
        onDone: () => {
          setStreams(prev => prev.map(s => 
            s.id === streamId ? { ...s, isActive: false, status: '' } : s
          ));
        },
        onError: (msg) => {
          setStreams(prev => prev.map(s => 
            s.id === streamId ? { ...s, isActive: false, status: `Error: ${msg}` } : s
          ));
        },
      }
    );
  };

  return (
    <div>
      <button onClick={() => addStream('Show me bugs')}>
        Ask: Show me bugs
      </button>
      <button onClick={() => addStream('Show performance data')}>
        Ask: Show performance data
      </button>
      
      <div className="streams-container">
        {streams.map(stream => (
          <div key={stream.id} className="stream-card">
            <h4>{stream.question}</h4>
            {stream.status && (
              <div className="status">{stream.status}</div>
            )}
            <div className="response">
              {stream.response || 'Waiting...'}
            </div>
            <div className="indicator">
              {stream.isActive ? '🔴 Active' : '✓ Complete'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Example 6: Streaming with Retry Logic
// ============================================================================

export function Example6_StreamingWithRetry() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(3);

  const attemptStream = (attempt: number = 0) => {
    let accumulatedText = '';

    startChatStream(
      {
        nlQuestion: question,
        projectId: 1,
        chatId: null,
      },
      {
        onToken: (chunk) => {
          accumulatedText += chunk;
          setResponse(accumulatedText);
        },
        onDone: () => {
          setRetryCount(0);
        },
        onError: (msg) => {
          if (attempt < maxRetries) {
            console.log(`Retry attempt ${attempt + 1}/${maxRetries}`);
            setRetryCount(attempt + 1);
            setTimeout(() => attemptStream(attempt + 1), 1000 * (attempt + 1));
          } else {
            setResponse(`Failed after ${maxRetries} attempts: ${msg}`);
          }
        },
      }
    );
  };

  const handleAsk = () => {
    setResponse('');
    setRetryCount(0);
    attemptStream(0);
    setQuestion('');
  };

  return (
    <div>
      <input 
        value={question} 
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
      />
      <button onClick={handleAsk}>Send</button>
      
      {retryCount > 0 && (
        <div className="retry-indicator">
          Retrying... (Attempt {retryCount}/{maxRetries})
        </div>
      )}
      
      <div className="response">{response}</div>
    </div>
  );
}
