import { ReactNode } from 'react';

interface PageContainerProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export default function PageContainer({ title, description, children }: PageContainerProps) {
  return (
    <section className="page-container">
      {title ? (
        <header className="page-heading">
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </header>
      ) : null}
      <div className="page-body">{children}</div>
    </section>
  );
}
