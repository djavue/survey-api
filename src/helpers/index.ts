import { Request, Response, RequestHandler } from 'express';

export enum ErrorName {
  'BadRequestError' = 'BadRequestError',
  'Forbidden' = 'Forbidden',
  'LimitRateExceeded' = 'LimitRateExceeded',
  'PostgresError' = 'PostgresError',
  'NotFound' = 'NotFound',
  'Unauthorized' = 'Unauthorized',
  'Unknown' = 'Unknown',
  'ValidationError' = 'ValidationError',
};

export enum SuccessName {
  'updateContentSuccess' = 'updateContentSuccess',
  'updateCategoryFavorite' = 'updateCategoryFavorite',
  'updateInformationSuccess' = 'updateInformationSuccess',
  'updateLtiSuccess' = 'updateLtiSuccess',
  'updateConfigSuccess' = 'updateConfigSuccess',
};

export interface ApiError {
  name: ErrorName
  message?: string
  code?: number
};

interface ApiMethodResponse<T> {
  statusCode?: number
  data: T
};

export const GlobalAuthorize  = {
  Student: ['Student'],
  Admin: ['Administrator', 'Technician']
};

export const RoleName = [
  'Guest',
  'Admin',
  'Technician',
  'Student',
];

export enum AuthorizeNum {
  Admin = 1,
  Technician = 2,
  Student = 3
}

type ApiMethodDefinition<T> = (req: Request) => Promise<ApiMethodResponse<T>>

export function apiMethod<T>(fn: ApiMethodDefinition<T>, isJson?: boolean): RequestHandler {
  return async function (req: Request, res: Response) {
    try {
      const session = await getSession(req.headers['authorization']?.replace(/Bearer /g , ''), req);
      const { statusCode, data } = await fn(req)
      if (data) {
        if (isJson) {
          res.set({
            'x-token': '' //session?.authToken ?? ''
          }).status(statusCode || 200).json(data)
        } else {
          res.status(statusCode || 200).send(data)
        }
      } else {
        res.sendStatus(statusCode || 200)
      }
    } catch (e) {
      handleError(res, e, isJson)
    }
  }
};

export function getIp(req: Request): string {
  return (req.headers['x-forwarded-for'] || req.connection.remoteAddress) as string
}

export async function getSession(token: string | undefined, req: Request) {
  return req.session;
}

export function getRoleName(authorize: number): string {
  switch (authorize) {
    case AuthorizeNum.Admin:
      return 'admin';
    case AuthorizeNum.Technician:
      return 'technician';
    case AuthorizeNum.Student:
      return 'student';
  }
  return 'unknown';
}

function isApiError(err: any): err is ApiError {
  return typeof err === 'object'
    && 'name' in err
    && Object.keys(ErrorName).includes(err.name)
    && (['undefined', 'number'].includes(typeof err.code))
    ;
}

function handleApiError(res: Response, error: ApiError, isJson?: boolean): void {
  if (error.code) {
    if (isJson) {
      res.status(error.code).json({ error })
    } else {
      res.status(error.code).send({ error })
    }
    return
  }

  switch (error.name) {
    case ErrorName.ValidationError:
    case ErrorName.BadRequestError:
      if (isJson) {
        res.status(400).json({ error })
      } else {
        res.status(400).send({ error })
      }
      break
    case ErrorName.Unauthorized:
      if (isJson) {
        res.status(401).json({ error })
      } else {
        res.status(401).send({ error })
      }
      break
    case ErrorName.Forbidden:
      if (isJson) {
        res.status(403).json({ error })
      } else {
        res.status(403).send({ error })
      }
      break
    case ErrorName.NotFound:
      if (isJson) {
        res.status(404).json({ error })
      } else {
        res.status(404).send({ error })
      }
      break
    case ErrorName.LimitRateExceeded:
      if (isJson) {
        res.status(509).json({ error })
      } else {
        res.status(509).send({ error })
      }
      break
    case ErrorName.PostgresError:
      if (isJson) {
        res.status(400).json({ error })
      } else {
        res.status(400).send({ error })
      }
      break
    case ErrorName.Unknown:
      if (isJson) {
        res.status(500).json({ error })
      } else {
        res.status(500).send({ error })
      }
      break
    default:
      throw new Error('Did not expect to reach this code')
  }
}

function handleError(res: Response, error: any, isJson?: boolean): void {
  if (isApiError) {
    handleApiError(res, error, isJson)
  } else {
    if (isJson) {
      res.status(500).json({ error })
    } else {
      res.status(500).send({ error })
    }
  }
}
