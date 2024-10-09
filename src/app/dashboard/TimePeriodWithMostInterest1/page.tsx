"use client";
import { useState } from 'react';

const Home = () => {
  const [productId, setProductId] = useState('');
  const [result, setResult] = useState<{ month: string; totalOrders: number } | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      const response = await fetch(`/api/TimePeriodWithMostInterest?productId=${productId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await response.json();
      setResult(data.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="container">
      <h1 className="title">Find Most Interest Period for a Product</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productId">Product ID:</label>
          <input
            type="text"
            id="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            className="input"
          />
        </div>
        <button type="submit" className="button">Submit</button>
      </form>

      {error && <p className="error">{error}</p>}
      {result && (
        <div className="result">
          <h2>Result:</h2>
          <p>
            The month with the most interest for product ID <strong>{productId}</strong> is <strong>{result.month}</strong> with <strong>{result.totalOrders}</strong> orders.
          </p>
        </div>
      )}
      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .title {
          text-align: center;
          font-size: 2rem;
          color: #333;
          margin-bottom: 20px;
        }

        .form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          margin-bottom: 5px;
          font-weight: bold;
        }

        .input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .input:focus {
          border-color: #0070f3;
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.3);
        }

        .button {
          padding: 10px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .button:hover {
          background-color: #005bb5;
        }

        .error {
          color: red;
          text-align: center;
          margin-top: 10px;
        }

        .result {
          margin-top: 20px;
          padding: 10px;
          background-color: #e6ffe6;
          border: 1px solid #a3e6a3;
          border-radius: 4px;
        }

        strong {
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default Home;
