import { Application, Request, Response } from 'express';
import db from './helpers/db';

import { User } from './entities/User';

export default (app: Application): void => {

  app.get('/', (req: Request, res: Response) => {
      res.status(200).send('OK');
  });

  // test
  app.get('/users', async (req: Request, res: Response) => {
    const data = await db.getRepository(User).find();
    res.json(data);
  });
  app.get('/users/:id', async (req: Request, res: Response) => {
    const data = await db.getRepository(User).findOneBy({
        id: parseInt(req.params.id)
    });
    res.json(data);
  });
  app.post('/users', async (req: Request, res: Response) => {
    try {
        if (req.body.length != 0) {
            await db.getRepository(User).insert(req.body);
            res.json({ message: 'Values inserted successfully!' })
        } else {
            res.json({ error: 'No payload provided.' })
        }
    } catch (err) {
        res.json({ error: err })
    }
  });
};
