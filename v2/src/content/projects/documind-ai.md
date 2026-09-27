---
title: DocuMind AI
order: 1
thesis: A local AI assistant that answers questions about your PDFs, with page citations, and never sends your documents anywhere.
state: shipped
stack:
  - Python
  - LangChain
  - FAISS
  - Ollama (Llama 3, Mistral, LLaVA)
  - Streamlit
proofLine: 294/294 tests pass
links:
  - label: Source on GitHub
    href: https://github.com/fdavchev/DocuMind-AI
proofs:
  - claim: 294 of 294 tests pass
    command: pytest
    status: verified
    checked: 2026-09-27
  - claim: Embeddings come from nomic-embed-text-v2-moe
    source: documind/config.py in the repo
    status: verified
    checked: 2026-09-27
figures:
  - src: ../../assets/screenshots/documind-sources-expanded.png
    alt: "DocuMind’s PDF Q&A tab. An answer to “What is this document about?” sits above an open Sources panel reading: [1] text.pdf, p. 1, followed by the quoted passage."
    caption: "Every answer can be checked. Open Sources and citation [1] names the file and page, text.pdf, page 1, and quotes the exact passage the answer came from."
    role: lead
  - src: ../../assets/screenshots/documind-initial.png
    alt: DocuMind’s Chat tab with LLaVA selected as the chat model and an image upload in the sidebar.
    caption: The Chat tab. Plain chat, or upload an image in the sidebar and ask about it.
    role: sequence
  - src: ../../assets/screenshots/documind-pdfqa-tab.png
    alt: The PDF Q&A tab with an empty Upload PDFs box.
    caption: The PDF Q&A tab, before any document is added.
    role: sequence
  - src: ../../assets/screenshots/documind-uploaded.png
    alt: text.pdf uploaded, with a spinner reading “Reading and indexing text.pdf”.
    caption: Reading and indexing the uploaded PDF.
    role: sequence
  - src: ../../assets/screenshots/documind-ingested.png
    alt: A confirmation that text.pdf is indexed, 1 page and 1 chunk in 4.3 seconds, with “Answering from text.pdf” below it.
    caption: Indexed. One page, one chunk, 4.3 seconds.
    role: sequence
  - src: ../../assets/screenshots/documind-answer.png
    alt: An answer about the document’s project budget and report deadline that ends with the citation [1], and a closed Sources panel under it.
    caption: The answer, ending in its [1] citation.
    role: sequence
---

## What it does

Upload a PDF, ask a question in plain language, and get an answer with numbered citations. Open **Sources** under any answer and you see the file, the page, and the quoted text each citation came from, so an answer can always be checked against the document itself.

## Why it runs locally

There is no hosted LLM API anywhere in the pipeline. The chat models (Llama 3, Mistral, and LLaVA for images) run on your own machine through Ollama, the embeddings come from nomic-embed-text-v2-moe, and the vector index lives in FAISS. Your documents never leave the computer they’re on.

## Built as a capstone

DocuMind is a retrieval-augmented generation (RAG) pipeline built from scratch as a university capstone, with its own evaluation set.
