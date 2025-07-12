import React, { useState, useEffect, useRef } from "react";
import {
  FaTrash,
  FaThList,
  FaSearch,
  FaDownload,
  FaClock,
  FaEllipsisV,
  FaFileWord,
  FaFilePdf,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
  FaUpload,
} from "react-icons/fa";

const prettySize = (bytes) =>
  bytes > 1024 * 1024
    ? `${(bytes / 1024 ** 2).toFixed(1)} MB`
    : `${(bytes / 1024).toFixed(1)} KB`;

const smIcon = (ext) => {
  switch (ext) {
    case "docx":
      return <FaFileWord className="text-primary fs-4 me-2" />;
    case "pdf":
      return <FaFilePdf className="text-danger fs-4 me-2" />;
    case "xlsx":
      return <FaFileExcel className="text-success fs-4 me-2" />;
    case "psd":
    case "ai":
      return <FaFileImage className="text-info fs-4 me-2" />;
    default:
      return <FaFileAlt className="text-secondary fs-4 me-2" />;
  }
};

const lgIcon = (ext) => {
  switch (ext) {
    case "docx":
      return <FaFileWord className="text-secondary fs-1" />;
    case "pdf":
      return <FaFilePdf className="text-secondary fs-1" />;
    case "xlsx":
      return <FaFileExcel className="text-secondary fs-1" />;
    case "psd":
    case "ai":
      return <FaFileImage className="text-secondary fs-1" />;
    default:
      return <FaFileAlt className="text-secondary fs-1" />;
  }
};

const starter = [];

const FileManagementSystem = () => {
  const [files, setFiles] = useState(starter);
  const [grid, setGrid] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const addFiles = (fileList) => {
    const newFiles = Array.from(fileList).map((f) => {
      const parts = f.name.split(".");
      const ext = parts.pop();
      const base = parts.join(".");
      return {
        name: base,
        extension: ext,
        project: "—",
        task: "—",
        size: prettySize(f.size),
        modified: new Date().toLocaleDateString(),
        version: "v1",
      };
    });
    setFiles((prev) => [...newFiles, ...prev]);
    setShowUpload(false);
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    setDragOver(false);
    if (e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
    setShowUpload(false); // Hide modal if drag overlay is active
  };

  const handleDragLeave = () => setDragActive(false);

  useEffect(() => {
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragleave", handleDragLeave);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  return (
    <div className="container-fluid bg-main  p-4 min-vh-100 position-relative">
      {dragActive && (
        <div className="drag-overlay">
          <div className="text-center text-primary">
            <i className="bi bi-upload fs-1"></i>
            <p className="fs-4 fw-semibold ">Drop files anywhere to upload</p>
          </div>
        </div>
      )}

      <h3 className="gradient-heading">File Management</h3>

      <div className="row g-3 align-items-center mb-3 mt-3">
        <div className="col-12 col-md-auto">
          <div className="d-flex flex-column flex-md-row gap-2">
            <button
              className="btn btn-primary d-flex align-items-center gap-1"
              onClick={() => {
                setShowUpload(true);
                setDragActive(false); // Hide drag overlay if open
              }}
            >
              <FaUpload /> Upload
            </button>
            <button className="btn btn-outline-secondary d-flex align-items-center gap-1">
              <FaTrash /> Delete
            </button>
            <button
              className={`btn btn-outline-secondary ${!grid ? "active" : ""}`}
              onClick={() => setGrid(false)}
            >
              <FaThList />
            </button>
            <button
              className={`btn btn-outline-secondary ${grid ? "active" : ""}`}
              onClick={() => setGrid(true)}
            >
              <i className="bi bi-grid-fill"></i>
            </button>
          </div>
        </div>
        <div className="col-12 col-md">
          <div className="d-flex flex-column flex-md-row gap-2">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search files..."
              />
            </div>
            <select className="form-select">
              <option>All Projects</option>
            </select>
            <select className="form-select">
              <option>All Tasks</option>
            </select>
          </div>
        </div>
      </div>

      {grid ? (
        <div className="row g-3">
          {files.map((f, i) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 " key={i}>
              <div className="card bg-card h-100  shadow-sm">
                <div className="card-body  text-center">
                  {lgIcon(f.extension)}
                  <h6 className="mt-3">
                    {f.name}.{f.extension}
                  </h6>
                  <small className=" d-block">
                    {f.size} • {f.version}
                  </small>
                  <small className="">{f.modified}</small>
                </div>
                <div className="card-footer d-flex  justify-content-between align-items-center">
                  <span className="badge bg-light text-dark">{f.task}</span>
                  <div className="d-flex gap-2">
                    <FaDownload className="text-secondary" role="button" />
                    <FaClock className="text-secondary" role="button" />
                    <FaEllipsisV className="text-secondary" role="button" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-responsive  rounded shadow-sm">
          <table className="table align-middle   table-hover mb-0 table-gradient-bg">
            <thead
              className="table-gradient-bg table "
              style={{
                position: "sticky",
                top: 0,
                zIndex: 0,
                backgroundColor: "#fff", // Match your background color
              }}
            >
              <tr  className="text-center">
                <th>
                  <input type="checkbox" />
                </th>
                <th>Name</th>
                <th>Project</th>
                <th>Task</th>
                <th>Size</th>
                <th>Modified</th>
                <th>Version</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f, i) => (
                <tr key={i}  className="text-center">
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td className="d-flex  align-items-center">
                    {smIcon(f.extension)}
                    <div>
                      <div className="fw-semibold">
                        {f.name}.{f.extension}
                      </div>
                      <small className=" ">.{f.extension}</small>
                    </div>
                  </td>
                  <td>{f.project}</td>
                  <td>{f.task}</td>
                  <td>{f.size}</td>
                  <td>{f.modified}</td>
                  <td>{f.version}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <FaDownload className="text-secondary" role="button" />
                      <FaClock className="text-secondary" role="button" />
                      <FaEllipsisV className="text-secondary" role="button" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* ======================== UPLOAD MODAL ===================== */}
      {showUpload && (
        <>
          <div
            className="modal fade show d-block "
            tabIndex="-1"
            role="dialog"
            onClick={() => setShowUpload(false)}
          >
            <div
              className="modal-dialog modal-dialog-centered "
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content bg-card">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">Upload Files</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowUpload(false)}
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-body">
                  <div
                    className={`upload-zone d-flex flex-column justify-content-center align-items-center text-center p-5 rounded ${
                      dragOver ? "dragover" : ""
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current.click()}
                  >
                    <FaUpload className="fs-2 mb-2 text-primary" />
                    <p className="mb-1">Drag &amp; drop files here</p>
                    <p className="small mb-0">or click to browse</p>
                    <input
                      type="file"
                      multiple
                      className="d-none"
                      ref={inputRef}
                      onChange={(e) => addFiles(e.target.files)}
                    />
                  </div>
                </div>

                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowUpload(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default FileManagementSystem;

