import React from 'react';
import Layout from './common/Layout/Layout';
import { Switch, Route, Redirect } from 'react-router';
import MainPage from './main/MainPage/MainPage';
import BookDetails from './book/BookDetails/BookDetails';
import AuthorList from './author/AuthorList/AuthorList';
import TagList from './tag/TagList/TagList';
import BookEditOrCreate from './book/BookEditOrCreate/BookEditOrCreate';

class App extends React.Component {

   render() {
      return (
         <Layout>
            <Switch>
               <Route exact path="/books/details/:id" component={BookDetails} />
               <Route exact path="/books/edit/:id" render={() => <BookEditOrCreate isCreate={false} />} />
               <Route exact path="/books/create" render={() => <BookEditOrCreate isCreate={true} />}/>
               <Route exact path="/authors" component={AuthorList} />
               <Route exact path="/tags" component={TagList} />
               <Route exact path={["/books/list/:category/page:page", "/books/list", "/"]} component={MainPage} />
               <Redirect to="/" />
            </Switch>
         </Layout>
      );
   }
}
export default App;