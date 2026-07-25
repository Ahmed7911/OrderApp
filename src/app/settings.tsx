import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";

interface CustomerProfileProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  photo: string;
}

const API_BASE_URL = Platform.OS === "android" ? "http://10.0.2.2:3001" : "http://localhost:3001";

export default function SettingsScreen() {
  const [customers, setCustomers] = useState<CustomerProfileProps[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfileProps | null>(null);
  const [isViewModalVisible, setViewModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/customers`);
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        }
      } catch (error) {
        console.error("Failed to load customers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const handleSave = async (customer: CustomerProfileProps) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${customer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });

      if (response.ok) {
        const updatedCustomer = await response.json();
        setCustomers((prev) => prev.map((item) => (item.id === updatedCustomer.id ? updatedCustomer : item)));
        setEditModalVisible(false);
      }
    } catch (error) {
      console.error("Failed to save customer:", error);
    }
  };

  const handleDelete = async (customer: CustomerProfileProps) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${customer.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCustomers((prev) => prev.filter((item) => item.id !== customer.id));
      }
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
  };

  const handleView = (customer: CustomerProfileProps) => {
    setSelectedCustomer(customer);
    setViewModalVisible(true);
  };

  const handleEdit = (customer: CustomerProfileProps) => {
    setSelectedCustomer(customer);
    setEditModalVisible(true);
  };

  const handleChange = (field: keyof CustomerProfileProps, value: string) => {
    if (selectedCustomer) {
      setSelectedCustomer({ ...selectedCustomer, [field]: value });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customers</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3805f0" style={styles.loader} />
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {customers.map((customer) => (
            <View key={customer.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Image source={{ uri: customer.photo }} style={styles.avatar} />
                <View style={styles.cardInfo}>
                  <Text style={styles.name}>{customer.name}</Text>
                  <Text style={styles.email}>{customer.email}</Text>
                </View>
              </View>

              <Text style={styles.info}>📞 {customer.phone}</Text>
              <Text style={styles.info}>🏠 {customer.address}</Text>
              <Text style={styles.info}>🌆 {customer.city}</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.viewButton]} onPress={() => handleView(customer)}>
                  <Text style={styles.buttonText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => handleEdit(customer)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(customer)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={isViewModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedCustomer && (
              <>
                <Image source={{ uri: selectedCustomer.photo }} style={styles.avatarLarge} />
                <Text style={styles.name}>{selectedCustomer.name}</Text>
                <Text style={styles.email}>{selectedCustomer.email}</Text>
                <Text style={styles.info}>📞 {selectedCustomer.phone}</Text>
                <Text style={styles.info}>🏠 {selectedCustomer.address}</Text>
                <Text style={styles.info}>🌆 {selectedCustomer.city}</Text>
              </>
            )}
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setViewModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={isEditModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedCustomer && (
              <>
                <Text style={styles.modalTitle}>Edit Customer</Text>
                <TextInput style={styles.input} value={selectedCustomer.name} onChangeText={(val) => handleChange("name", val)} placeholder="Name" />
                <TextInput style={styles.input} value={selectedCustomer.email} onChangeText={(val) => handleChange("email", val)} placeholder="Email" />
                <TextInput style={styles.input} value={selectedCustomer.phone} onChangeText={(val) => handleChange("phone", val)} placeholder="Phone" />
                <TextInput style={styles.input} value={selectedCustomer.address} onChangeText={(val) => handleChange("address", val)} placeholder="Address" />
                <TextInput style={styles.input} value={selectedCustomer.city} onChangeText={(val) => handleChange("city", val)} placeholder="City" />

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => handleSave(selectedCustomer)}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setEditModalVisible(false)}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    padding: 16,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#3805f0",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    width: "95%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#e63946",
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#e63946",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  email: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  info: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  viewButton: {
    backgroundColor: "#2563eb",
  },
  editButton: {
    backgroundColor: "#f59e0b",
  },
  deleteButton: {
    backgroundColor: "#dc2626",
  },
  saveButton: {
    backgroundColor: "#16a34a",
  },
  cancelButton: {
    backgroundColor: "#6b7280",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1F2937",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    color: "#111827",
  },
});