import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import mainImage from '@/assets/images/crystal-ball.png'
import { Form, Button, Spinner } from 'react-bootstrap'
import { FormEvent, useState } from 'react'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [quote, setQuote] = useState(" ");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [QuoteLoadingError, setQuoteLoadingError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const prompt = formData.get("prompt")?.toString().trim();
    
    if (prompt){
      try{
        setQuote("");
        setQuoteLoadingError(false);
        setQuoteLoading(true);

        const response = await fetch("/api/reading?prompt=" + encodeURIComponent(prompt));
        const body = await response.json();
        setQuote(body.quote);

      } catch (error){
        console.error(error);
        setQuoteLoadingError(true);
      } finally {
        setQuoteLoading(false);
      }
    }
  }

  return (
    <>
      <Head>
        <title>Timo's Mind Reader</title>
        <meta name="description" content="Timo + GPT-3 will read your mind." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Mind Reader</h1>
        <h2>Timo + GPT3 reads your mind</h2>
        <div>Enter a topic and GPT-3 will read your future.</div>
        <div className={styles.mainImageContainer}>
          <Image
          src = {mainImage} 
          fill
          alt='A cartoon emoji of a crystal ball'
          priority 
          className={styles.mainImage}
          />
        </div>
        
        <Form onSubmit = {handleSubmit} className = {styles.inputForm}>
        
          <Form.Group className = 'mb-3' controlId = 'prompt-input'>
            <Form.Label>Create a prediction about your future... </Form.Label>
            <Form.Control
            name = 'prompt'
            placeholder='e.g. Will I die on Mars?'
            maxLength = {100}
            />
          </Form.Group>
          <Button type = 'submit' className = 'mb-3' disabled ={quoteLoading}>
            Tell me please
          </Button>
        </Form>
        {quoteLoading && <Spinner animation ='boarder'/>}
        {QuoteLoadingError && "Something went wrong. Please ask again."}
        {quote && <h5>{quote}</h5>}
      </main>
    </>
  )
}
