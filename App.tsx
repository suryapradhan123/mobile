/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import React, { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, TextInput, Button, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  // Call FastAPI backend
  const handleAsk = async () => {
    setLoading(true);
    setAnswer('');
    try {
      const response = await fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAnswer(data.answer || 'No answer received.');
    } catch (error) {
      if (error instanceof Error) {
        setAnswer('Error contacting backend: ' + error.message);
      } else {
        setAnswer('Error contacting backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Condo Agent Q&amp;A</Text>
          <TextInput
            style={styles.input}
            placeholder="Ask a question about your condo bylaws..."
            value={question}
            onChangeText={setQuestion}
            multiline
          />
          <Button title={loading ? 'Asking...' : 'Ask'} onPress={handleAsk} disabled={loading || !question.trim()} />
          <View style={styles.answerBox}>
            <Text style={styles.answerLabel}>Answer:</Text>
            <Text style={styles.answerText}>{answer}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2a2a2a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 60,
    backgroundColor: '#f9f9f9',
  },
  answerBox: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f1f8e9',
    borderRadius: 8,
    minHeight: 80,
  },
  answerLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#388e3c',
  },
  answerText: {
    fontSize: 16,
    color: '#333',
  },
});

export default App;
