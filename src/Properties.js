import React, { useState } from "react";
import "./Properties.css";

export default function Properties({ properties, setProperties }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "Mieszkanie",
    rooms: "",
    area: "",
    price: "",
    status: "Dostępne",
    images: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, index) => index !== indexToRemove),
    });
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.value = "";
  };

  const handleAddProperty = (e) => {
    e.preventDefault();
    const newProperty = {
      id: Date.now(),
      ...formData,
      rooms: parseInt(formData.rooms),
      area: parseFloat(formData.area),
      price: parseFloat(formData.price),
    };
    setProperties([...properties, newProperty]);
    resetForm();
  };

  const handleEditProperty = (e) => {
    e.preventDefault();
    setProperties(
      properties.map((prop) =>
        prop.id === editingId
          ? {
              ...formData,
              id: editingId,
              rooms: parseInt(formData.rooms),
              area: parseFloat(formData.area),
              price: parseFloat(formData.price),
            }
          : prop
      )
    );
    resetForm();
  };

  const handleDeleteProperty = (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę nieruchomość?")) {
      setProperties(properties.filter((prop) => prop.id !== id));
    }
  };

  const startEdit = (property) => {
    setEditingId(property.id);
    setFormData({ ...property, images: property.images || [] });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      type: "Mieszkanie",
      rooms: "",
      area: "",
      price: "",
      status: "Dostępne",
      images: [],
    });
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="properties-outer-wrapper">
      <div className="properties-container">
        <div className="properties-header">
          <div className="header-center-title">
            <h2>Nieruchomości</h2>
          </div>
          <button className="btn-add" onClick={() => setShowForm(!showForm)}>
            {showForm ? "❌ Anuluj" : "➕ Dodaj nieruchomość"}
          </button>
        </div>

        {showForm && (
          <div className="property-form">
            <h3>{editingId ? "✏️ Edytuj nieruchomość" : "➕ Nowa nieruchomość"}</h3>
            <form onSubmit={editingId ? handleEditProperty : handleAddProperty}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nazwa obiektu:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Dokładny adres:</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Zdjęcia obiektu (możesz wybrać kilka):</label>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" }}>
                {formData.images.map((img, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <img
                      src={img}
                      alt="Podgląd"
                      style={{
                        height: "60px",
                        width: "60px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        fontSize: "10px",
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Typ:</label>
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="Mieszkanie">Mieszkanie</option>
                    <option value="Dom">Dom</option>
                    <option value="Kawalerka">Kawalerka</option>
                    <option value="Apartament">Apartament</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Pokoje:</label>
                  <input type="number" name="rooms" value={formData.rooms} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>m²:</label>
                  <input type="number" name="area" value={formData.area} onChange={handleInputChange} step="0.1" required />
                </div>
                <div className="form-group">
                  <label>Cena (zł):</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn-save">
                  💾 {editingId ? "Zapisz zmiany" : "Dodaj nieruchomość"}
                </button>
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Anuluj
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="properties-list-section">
          <h3 className="list-title">
             Lista wszystkich nieruchomości ({properties.length})
          </h3>
          <div className="properties-grid">
            {properties.map((property) => (
              <div key={property.id} className="property-card compact">
                <div
                  className="property-card-img-container"
                  style={{
                    width: "100%",
                    height: "120px",
                    background: "#f0f0f0",
                    borderRadius: "8px 8px 0 0",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontSize: "2rem" }}>🏠</span>
                  )}
                </div>

                <div className="property-header-card">
                  <h4>{property.name}</h4>
                  <span className={`status-badge status-${property.status.toLowerCase()}`}>
                    {property.status}
                  </span>
                </div>

                <div className="property-details">
                  <p className="addr">📍 {property.address}</p>
                  <div className="info-row">
                    <span>🏠 {property.type}</span>
                    <span>🚪 {property.rooms} pok.</span>
                    <span>📐 {property.area} m²</span>
                  </div>
                  <p className="property-price">
                    💰 {property.price.toLocaleString()} zł/mies
                  </p>
                </div>

                <div className="property-actions">
                  <button className="btn-edit" onClick={() => startEdit(property)}>
                    ✏️ Edytuj
                  </button>
                  <button className="btn-delete" onClick={() => handleDeleteProperty(property.id)}>
                    🗑️ Usuń
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
