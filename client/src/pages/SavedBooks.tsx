import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import { getUser } from '../utils/queries';
import { bookRemoved } from '../utils/mutation';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import type { User } from '../models/User';
import { useQuery, useMutation } from '@apollo/client';

const SavedBooks = () => {
  
  const { loading, data } = useQuery(getUser);
  const userData: User = data?.me || { savedBooks: [] };

  
  const [removeBook] = useMutation(bookRemoved, {
    
    refetchQueries: [getUser, 'me'],
  });


  const handleDeleteBook = async (bookId: string) => {
    if(!Auth.loggedIn()) return false;

    try {
      await removeBook({ variables: { bookId } });

 
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md='4'>
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;