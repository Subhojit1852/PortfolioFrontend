import { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Dialog,
  DialogContent,
  TextField,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import CloudIcon from '@mui/icons-material/Cloud';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SkillGame from './SkillGame';

type Message = {
  sender: 'user' | 'bot';
  text?: string;
  code?: string;
  language?: string;
};

const errorResponses = [
  "404 Answer Not Found.",
  "My neural nets are tingling… that question's unclear.",
  "I encountered a segmentation fault… just kidding!",
];

const easterEggs: Record<string, string> = {
  "sudo make me a sandwich": "What? Make it yourself.",
  "/skills": "Subhojit is skilled in FastAPI, React, LangChain, Azure, MSAL, and more!",
  "/projects": "Ask about the GenAI Chatbot, Writing Automation Tool, or CryptoBot.",
  "/resume": "Download: [GitHub Repo](https://github.com/Subhojit1852)",
  "/contact": "Email: subhojitganguly2@gmail.com | LinkedIn: /subhojit-ganguly-53025618b"
};

const codeExamples: Record<string, string> = {
  python: `
\`\`\`python
def greet(name):
    print(f"Hello, {name}!")

greet("World")
\`\`\`
  `,
  java: `
\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}
\`\`\`
  `,
  javascript: `
\`\`\`javascript
function greet(name) {
  console.log("Hello, " + name);
}

greet("World");
\`\`\`
  `,
  typescript: `
\`\`\`typescript
function greet(name: string): void {
  console.log(\`Hello, \${name}\`);
}

greet("World");
\`\`\`
  `
};

export default function Chatbot() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm JobJarvis 🤖. Ask me about Subhojit's skills or experience!", sender: 'bot' }
  ]);
  const [loading, setLoading] = useState(false);
  const [llmStatus, setLlmStatus] = useState('Online');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const simulateTyping = (text: string) => {
    let index = 0;
    const interval = setInterval(() => {
      setMessages(prev => {
        const last = prev[prev.length - 1];
        const newText = last?.sender === 'bot' ? (last.text + text[index]) : text[index];
        return [...prev.slice(0, -1), { text: newText, sender: 'bot' }];
      });
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 20);
  };

  const extractCodeBlock = (text: string): { code: string; language: string } | null => {
    const codeRegex = /```(\w+)?\s*([\s\S]*?)```/;
    const match = text.match(codeRegex);
    if (match) {
      return {
        language: match[1] || 'plaintext',
        code: match[2].trim(),
      };
    }
    return null;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim().toLowerCase();

    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    setLoading(true);

    if (codeExamples[userText]) {
      const codeBlock = codeExamples[userText];
      const parsed = extractCodeBlock(codeBlock);

      if (parsed) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            code: parsed.code,
            language: parsed.language
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { sender: 'bot', text: `Here is a sample ${userText} code:` }
        ]);
      }
      setLoading(false);
      return;
    }

    if (easterEggs[userText]) {
      setMessages(prev => [...prev, { text: '', sender: 'bot' }]);
      simulateTyping(easterEggs[userText]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://beowolf321-portfolio-resume-api.hf.space/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input })
      });

      if (!res.ok) throw new Error('API down');

      const data = await res.json();
      const parsed = extractCodeBlock(data.response);
      if (parsed) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            code: parsed.code,
            language: parsed.language
          }
        ]);
      } else {
        setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
      }
      setLlmStatus('Online');
    } catch {
      const failMsg = errorResponses[Math.floor(Math.random() * errorResponses.length)];
      setMessages(prev => [...prev, { text: failMsg, sender: 'bot' }]);
      setLlmStatus('Offline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ 
        position: 'fixed',
        bottom: { xs: 16, sm: 24, md: 32 },
        right: { xs: 16, sm: 24, md: 32 },
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        pointerEvents: 'none',
        '& > *': {
          pointerEvents: 'auto'
        }
      }}>
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            backgroundColor: '#00ffc3',
            color: '#0f1117',
            width: { xs: 56, sm: 60, md: 64 },
            height: { xs: 56, sm: 60, md: 64 },
            marginLeft: 'auto',
            '&:hover': { 
              backgroundColor: '#00e6b8', 
              transform: 'scale(1.1)' 
            },
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          }}
        >
          <SmartToyIcon sx={{ fontSize: { xs: 28, sm: 30, md: 32 } }} />
        </IconButton>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            position: 'fixed',
            bottom: isMobile ? 0 : isTablet ? '5%' : 100,
            right: isMobile ? 0 : isTablet ? '5%' : 32,
            width: isMobile ? '100%' : isTablet ? '90%' : 500,
            height: isMobile ? '80vh' : isTablet ? '85vh' : '70vh',
            maxWidth: isTablet ? '90vw' : 500,
            maxHeight: isMobile ? 'none' : isTablet ? '85vh' : '70vh',
            borderTopLeftRadius: { xs: 12, sm: 8, md: 8 },
            borderTopRightRadius: { xs: 12, sm: 8, md: 8 },
            background: 'linear-gradient(to bottom, #0f1117, #111)',
            fontFamily: '"Courier New", monospace',
            color: '#00ffc3',
            border: '1px solid #00ffc3',
            overflow: 'hidden'
          }
        }}
      >
        <Box
          sx={{
            backgroundColor: '#00ffc3',
            color: '#0f1117',
            p: { xs: 1, sm: 1.5 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            JobJarvis
          </Typography>
          <Chip
            size="small"
            icon={<CloudIcon sx={{ color: '#0f1117', fontSize: { xs: 16, sm: 18 } }} />}
            label={`LLM: ${llmStatus}`}
            color={llmStatus === 'Online' ? 'success' : 'error'}
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '0.7rem', sm: '0.8rem' }
            }}
          />
          <IconButton 
            onClick={() => setOpen(false)} 
            sx={{ color: '#0f1117', p: { xs: 0.5, sm: 1 } }}
          >
            <CloseIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ 
          overflowY: 'auto', 
          p: { xs: 1, sm: 2 },
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#00ffc3',
            borderRadius: '3px',
          }
        }}>
          <List>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  px: 0,
                  py: 0.5
                }}
              >
                {msg.sender === 'bot' && (
                  <Avatar sx={{ 
                    bgcolor: '#00ffc3', 
                    color: '#0f1117', 
                    mr: 1,
                    width: { xs: 32, sm: 36, md: 40 },
                    height: { xs: 32, sm: 36, md: 40 }
                  }}>
                    <SmartToyIcon fontSize="small" />
                  </Avatar>
                )}
                <ListItemText
                  primary={
                    msg.code ? (
                      <SyntaxHighlighter 
                        language={msg.language || 'python'} 
                        style={atomDark}
                        customStyle={{
                          margin: 0,
                          padding: '12px',
                          borderRadius: '8px',
                          fontSize: '0.85rem'
                        }}
                      >
                        {msg.code}
                      </SyntaxHighlighter>
                    ) : (
                      msg.text
                    )
                  }
                  sx={{
                    bgcolor: msg.sender === 'user' ? '#00ffc3' : '#1e1e1e',
                    color: msg.sender === 'user' ? '#0f1117' : '#ffffff',
                    p: { xs: 1, sm: 1.5 },
                    borderRadius: 2,
                    maxWidth: { xs: '85%', sm: '75%', md: '70%' },
                    wordBreak: 'break-word',
                    '& .MuiListItemText-primary': {
                      fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' }
                    }
                  }}
                />
              </ListItem>
            ))}
            {loading && <SkillGame loading={true} />}
            <div ref={messagesEndRef} />
          </List>
        </DialogContent>

        <Box sx={{ 
          p: { xs: 1, sm: 1.5, md: 2 }, 
          borderTop: '1px solid #1e1e1e', 
          display: 'flex', 
          alignItems: 'center' 
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a command or question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: '#00ffc3' },
                '&:hover fieldset': { borderColor: '#00ffc3' },
              },
              mr: 1,
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                py: { xs: 1, sm: 1.25 }
              }
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!input.trim() || loading}
            sx={{ 
              color: '#00ffc3', 
              '&:disabled': { color: '#555' },
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 195, 0.1)'
              },
              p: { xs: 0.75, sm: 1 }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <SendIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            )}
          </IconButton>
        </Box>
      </Dialog>
    </>
  );
}